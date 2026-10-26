/* Three.js dependencies are provided by performance-3d-boot.js.
   This file contains the complete interactive lab. */
export function startUnitLab(THREE, OrbitControls, GLTFLoader){
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const canvas=$('#assemblyCanvas');
const upstream='https://raw.githubusercontent.com/brickshow/pc-anatomy/main/public/models/';
const specs=[
['motherboard','Motherboard','MB','01 · CORE HARDWARE','motherboard.glb',[2.58,2.80,.12],[-.40,.35,-.83],[-.40,.35,-.83],'Main circuit board. CPU, DIMMs, M.2 drive and cables connect here. A full ATX board is roughly 305 × 244 mm in real life.','Work on an ESD-safe mat; keep the computer unplugged.'],
['cpu','Processor / CPU','CPU','01 · CORE HARDWARE','cpu.glb',[.46,.46,.065],[-.76,.92,-.65],[-.76,.92,-.65],'Socketed processor. About 40 mm across on a full-size desktop CPU, far smaller than the motherboard.','Align the corner marker and socket. Never force a processor into place.'],
['ram','RAM DIMM Kit','RAM','02 · MEMORY & STORAGE','ram.glb',[.13,1.20,.30],[.68,.82,-.57],[.68,.82,-.57],'Memory modules slide into motherboard DIMM slots. Install in the board manufacturer’s recommended slots.','Use the correct DDR generation and make sure retention clips engage.'],
['storage','M.2 NVMe SSD','SSD','02 · MEMORY & STORAGE','m.2.glb',[.78,.24,.05],[-.81,-.43,-.66],[-.81,-.43,-.66],'Small NVMe SSD installed in an M.2 slot. Typical M.2 2280 drives are about 80 mm long.','Insert at the supported angle and secure with the correct standoff or latch.'],
['cooler','CPU Cooler','FAN','04 · COOLING & AIRFLOW','cpu_fan.glb',[.88,.88,.66],[-.76,.92,-.33],[-.76,.92,-.33],'Heatsink and fan assembly. Mount it over the CPU and connect the CPU_FAN cable.','Use the correct mounting hardware and thermal interface.'],
['psu','Power Supply','PSU','03 · POWER & GRAPHICS','psu.glb',[1.15,.85,1.0],[.97,-1.79,-.54],[.97,-1.79,-.54],'ATX power supply that powers motherboard, CPU, GPU, fans and drives.','Never open the PSU casing. Disconnect power when cabling.'],
['gpu','Graphics Card','GPU','03 · POWER & GRAPHICS','gpu.glb',[2.22,.58,.52],[-.05,-.88,-.42],[-.05,-.88,-.42],'Graphics card slides into the motherboard PCIe x16 slot and locks into the case bracket.','Check GPU and PCIe power connections, slot latch and card clearance.'],
['casefans','Case Cooling Fans','FANS','04 · COOLING & AIRFLOW','case_fans.glb',[.85,2.68,.34],[1.43,.03,-.45],[1.43,.03,-.45],'Fan assembly mounts to the case with airflow direction and fan-header requirements.','Match airflow arrows and avoid mixing incompatible RGB headers.']
];
const parts=specs.map(([id,name,short,category,filename,dims,pos,zone,desc,safety])=>({
 id,name,short,category,filename,dims,pos,zone,desc,safety,
 url:['ram','storage','psu'].includes(id)?'models/'+(id==='storage'?'m2-ssd':id)+'.glb':upstream+filename
}));
const byId=Object.fromEntries(parts.map(p=>[p.id,p]));
const sequence=['motherboard','cpu','ram','storage','cooler','psu','gpu','casefans'],reverse=[...sequence].reverse();
const user=sessionStorage.getItem('unitlab3d_local_auth')||sessionStorage.getItem('unitlab_student')||'GUEST';
$('#student').textContent=user==='GUEST'?'Guest · local practice':'Learner code: '+user+' (local demo)';
let renderer,scene,camera,controls,loader;
try{
 renderer=new THREE.WebGLRenderer({canvas:$('#assemblyCanvas'),antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.55;
 renderer.shadowMap.enabled=true;scene=new THREE.Scene();scene.background=new THREE.Color(0x091722);scene.fog=new THREE.FogExp2(0x091722,.025);
 camera=new THREE.PerspectiveCamera(40,1,.1,100);camera.position.set(7.0,3.8,11.7);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=6.0;controls.maxDistance=20;controls.maxPolarAngle=Math.PI*.85;controls.target.set(-.95,0,0);
 loader=new GLTFLoader();
}catch(e){$('#stageStatus').innerHTML='<strong>3D unavailable</strong><p>WebGL failed. Use the lightweight workbench instead.</p><a class="btn" href="training.html">Open fallback</a>';throw e}
scene.add(new THREE.HemisphereLight(0xe7eff5,0x303642,2.25));
const sun=new THREE.DirectionalLight(0xffffff,3.1);sun.position.set(5,8,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-9;sun.shadow.camera.right=9;sun.shadow.camera.top=9;sun.shadow.camera.bottom=-9;scene.add(sun);
const glow=new THREE.PointLight(0x75e6ce,20,11);glow.position.set(-3,2,3);scene.add(glow);
const pink=new THREE.PointLight(0xaec3f3,10,10);pink.position.set(3,1,-2);scene.add(pink);
/* Workspace v3: an actual horizontal assembly desk and scale-proportional hardware.
   The chassis/workshop furniture is procedural; selected components are textured GLB meshes. */
scene.background=new THREE.Color(0x17212c);
scene.fog=new THREE.FogExp2(0x17212c,.012);
renderer.toneMappingExposure=1.36;
camera.position.set(3.8,6.5,8.7);
controls.target.set(-.45,-2.02,-.10);
controls.minDistance=2.25;
controls.maxDistance=27;
controls.maxPolarAngle=Math.PI*.88;
const steel=new THREE.MeshStandardMaterial({color:0x555d64,metalness:.7,roughness:.43});
const dark=new THREE.MeshStandardMaterial({color:0x1d242b,metalness:.58,roughness:.52});
const circuit=new THREE.MeshStandardMaterial({color:0x1c272c,metalness:.35,roughness:.61});
const trim=new THREE.MeshStandardMaterial({color:0x252d33,metalness:.76,roughness:.40});
const screwMat=new THREE.MeshStandardMaterial({color:0xadb4b5,metalness:.93,roughness:.24});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(140,140),new THREE.MeshStandardMaterial({color:0x171c24,roughness:.95}));
ground.rotation.x=-Math.PI/2;ground.position.y=-3.67;ground.receiveShadow=true;scene.add(ground);
const bench=new THREE.Group();scene.add(bench);
function box(parent,dim,xyz,material){
 const obj=new THREE.Mesh(new THREE.BoxGeometry(...dim),material);
 obj.position.set(...xyz);obj.castShadow=true;obj.receiveShadow=true;parent.add(obj);return obj;
}
function makeWorktopTexture(){
 const c=document.createElement('canvas');c.width=512;c.height=512;
 const g=c.getContext('2d');g.fillStyle='#967d60';g.fillRect(0,0,512,512);
 for(let i=0;i<80;i++){
   const v=(Math.sin(i*14.37)*.5+.5);
   g.fillStyle='rgba('+(v>.5?'237,207,163':'35,25,19')+','+(0.02+v*.065)+')';
   g.fillRect(0,i*6.5,512,1+v*2.7);
 }
 for(let i=1;i<10;i++){g.fillStyle='rgba(12,12,14,.14)';g.fillRect(0,i*54,512,2);}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
 t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2.9,1.4);
 t.anisotropy=4;return t;
}
const maple=new THREE.MeshStandardMaterial({map:makeWorktopTexture(),roughness:.88,metalness:.02});
const rubber=new THREE.MeshStandardMaterial({color:0x0c252b,roughness:.95});
const matMaterial=new THREE.MeshStandardMaterial({color:0x1f3640,roughness:.96,metalness:0});
const desk=box(bench,[15.2,.24,8.1],[-.75,-2.83,-.10],maple);
box(bench,[15.2,.12,.18],[-.75,-2.99,3.84],dark);
for(const x of [-7.5,5.8])for(const z of [-3,3])box(bench,[.2,1.1,.2],[x,-3.5,z],steel);
const mat=box(bench,[4.55,.028,4.6],[-3.65,-2.675,-.15],matMaterial);
mat.castShadow=false;
for(const [dx,dz,dw,dd] of [[0,-2.23,4.43,.025],[0,2.23,4.43,.025],[-2.18,0,.025,4.45],[2.18,0,.025,4.45]]){
 box(bench,[dw,.015,dd],[-3.65+dx,-2.652,-.15+dz],rubber);
}
const matLineMat=new THREE.MeshBasicMaterial({color:0x477583,transparent:true,opacity:.22,depthWrite:false});
for(let i=0;i<20;i++){
 const k=-2.1+i*.22;
 const l=box(bench,[.009,.001,4.25],[-3.65+k,-2.653,-.15],matLineMat);l.castShadow=false;
 const h=box(bench,[4.25,.001,.009],[-3.65,-2.653,-2.28+i*.22],matLineMat);h.castShadow=false;
}
// Optional subtle storage drawers and pegboard are visual context, not draggable tools.
box(bench,[8.6,3.2,.14],[-.8,-.48,-4.1],trim);
// Pegboard holes use one GPU draw call instead of hundreds of meshes.
const pegboardHoles=new THREE.InstancedMesh(new THREE.CircleGeometry(.016,8),
 new THREE.MeshBasicMaterial({color:0x080d12}),12*32);
const pegDummy=new THREE.Object3D();let pegIndex=0;
for(let row=0;row<12;row++)for(let col=0;col<32;col++){
 pegDummy.position.set(-5+col*.26,-1.9+row*.235,-4.014);
 pegDummy.updateMatrix();pegboardHoles.setMatrixAt(pegIndex++,pegDummy.matrix);
}
pegboardHoles.instanceMatrix.needsUpdate=true;bench.add(pegboardHoles);
const storageMat=new THREE.MeshStandardMaterial({color:0x303e49,metalness:.6,roughness:.54});
/* Workshop details - physical Three.js geometry, never a background screenshot.
   Neutral PBR materials and task lighting make the assembly area legible. */
const accentMetal=new THREE.MeshStandardMaterial({color:0x8c989f,metalness:.90,roughness:.29});
const paintBlack=new THREE.MeshStandardMaterial({color:0x0b1016,roughness:.55,metalness:.36});
const coloredRubber=[
 new THREE.MeshStandardMaterial({color:0xc7442d,roughness:.59}),
 new THREE.MeshStandardMaterial({color:0x2662a8,roughness:.62}),
 new THREE.MeshStandardMaterial({color:0xf0b63b,roughness:.61}),
 new THREE.MeshStandardMaterial({color:0x24323b,roughness:.71})
];
const ledMaterial=new THREE.MeshBasicMaterial({color:0xffc075});
box(bench,[8.6,.095,.13],[-.8,-1.98,-3.95],ledMaterial);
box(bench,[8.8,.1,.24],[-.8,-2.035,-4.09],steel);
// Wall-mounted service tools: handles, shafts, hooks and a tool rail.
function cylinder(parent,rTop,rBottom,height,x,y,z,material,segments=14){
 const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rTop,rBottom,height,segments),material);
 mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
function hangingDriver(x,color,length=1.02){
 box(bench,[.06,.09,.33],[x,1.02,-3.85],accentMetal);
 cylinder(bench,.089,.105,.43,x,.76,-3.62,color);
 cylinder(bench,.023,.024,length,x,.03,-3.62,accentMetal);
 cylinder(bench,.045,.045,.04,x,-.49,-3.62,paintBlack);
}
for(let i=0;i<8;i++)hangingDriver(-4.8+i*.62,coloredRubber[i%4],.84+(i%3)*.18);
function hangingWrench(x){
 const metal=accentMetal;
 cylinder(bench,.034,.04,1.0,x,.24,-3.63,metal);
 const jaw=new THREE.Mesh(new THREE.TorusGeometry(.16,.035,8,24,Math.PI*1.45),metal);
 jaw.position.set(x,-.33,-3.63);jaw.rotation.z=Math.PI*.45;bench.add(jaw);
 box(bench,[.08,.075,.35],[x,.99,-3.88],steel);
}
hangingWrench(1.5);hangingWrench(2.10);
// Magnetic bits tray and precision screwdriver lying on the wood surface.
const trayOuter=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.11,32),steel);
trayOuter.position.set(-6.60,-2.64,2.75);trayOuter.receiveShadow=true;bench.add(trayOuter);
const trayInside=new THREE.Mesh(new THREE.CylinderGeometry(.375,.375,.02,32),paintBlack);
trayInside.position.set(-6.60,-2.575,2.75);bench.add(trayInside);
for(let i=0;i<19;i++){
 const a=i*2.3999,rad=.095+(i%5)*.052;
 const screw=cylinder(bench,.028,.028,.045,-6.60+Math.cos(a)*rad,-2.54,2.75+Math.sin(a)*rad,accentMetal,10);
 screw.rotation.z=(i%7)*.18;
}
const driverBody=cylinder(bench,.105,.10,.82,-4.75,-2.52,3.10,coloredRubber[1]);
driverBody.rotation.z=Math.PI/2;
const driverSteel=cylinder(bench,.031,.034,.66,-4.02,-2.52,3.10,accentMetal);driverSteel.rotation.z=Math.PI/2;
// Under-desk drawer system: handles, accent edges and dark lower shelves.
box(bench,[2.15,1.20,1.45],[5.85,-3.34,-1.85],paintBlack);
for(let i=0;i<3;i++){
 box(bench,[1.95,.29,.055],[5.85,-3.68+i*.34,-1.08],storageMat);
 box(bench,[.57,.045,.06],[5.85,-3.68+i*.34,-1.045],accentMetal);
}
// Desk plant with pot and tapered leaves, away from the assembly mat.
const pot=new THREE.Mesh(new THREE.CylinderGeometry(.35,.26,.54,18),new THREE.MeshStandardMaterial({color:0x52473b,roughness:.9}));
pot.position.set(-6.95,-2.48,-2.9);bench.add(pot);
const leafMat=new THREE.MeshStandardMaterial({color:0x4b7d57,roughness:.92,side:THREE.DoubleSide});
for(let i=0;i<11;i++){
 const angle=i*2.4,leafLength=.65+(i%4)*.17;
 const leaf=new THREE.Mesh(new THREE.SphereGeometry(.105,9,7),leafMat);
 leaf.position.set(-6.95+Math.cos(angle)*.28,-2.01+leafLength*.35,-2.9+Math.sin(angle)*.25);
 leaf.scale.set(.57,leafLength*3,.29);leaf.rotation.z=(i%2?-.37:.42);bench.add(leaf);
}
// Subtle task lighting emitted by the workshop strip.
const ledGlow=new THREE.PointLight(0xffc485,23,8,2);
ledGlow.position.set(-1.15,-1.48,-3.25);scene.add(ledGlow);

for(let i=0;i<5;i++){
 const drawer=box(bench,[.9,.40,.68],[-6.3,-2.35+i*.42,-3.1],storageMat);
 box(bench,[.52,.025,.02],[-6.3,-2.38+i*.42,-2.744],screwMat);
}
// Chassis: side-open, actual PC-case form with a bottom tray, rails and vents.
const rig=new THREE.Group();scene.add(rig);
rig.position.set(2.28,-1.36,-.10);
const caseSideGlassMaterial=new THREE.MeshPhysicalMaterial({color:0xa1c2cf,metalness:.03,roughness:.08,transparent:true,opacity:.14,depthWrite:false,side:THREE.DoubleSide});
const panelGlass=box(rig,[3.5,4.78,.022],[0,0,1.19],caseSideGlassMaterial);
panelGlass.visible=false;panelGlass.castShadow=false;
box(rig,[3.68,4.95,.12],[0,0,-1.17],steel);                 // baseplate
box(rig,[.12,4.95,1.35],[-1.86,0,-.48],dark);                    // back edge
box(rig,[.12,4.95,1.35],[1.86,0,-.48],dark);                     // front edge
box(rig,[3.72,.14,1.35],[0,2.51,-.48],trim);                    // top
box(rig,[3.72,.14,1.35],[0,-2.51,-.48],trim);                   // bottom
box(rig,[2.87,3.54,.065],[-.28,.34,-1.02],new THREE.MeshStandardMaterial({color:0x354349,metalness:.69,roughness:.46}));        // mounting tray
for(const x of [-1.35,-.27,.82])for(const y of [-1.02,.20,1.40]){
 const s=new THREE.Mesh(new THREE.CylinderGeometry(.058,.058,.080,14),screwMat);
 s.rotation.x=Math.PI/2;s.position.set(x,y,-.92);rig.add(s);
}
// PSU bay / structural rail
box(rig,[1.47,.81,.9],[.96,-1.86,-.48],dark);
for(let row=0;row<7;row++){
 box(rig,[1.31,.025,.020],[.97,-2.20+row*.09,.12],steel);
}
const ventMaterial=new THREE.MeshStandardMaterial({color:0x11171b,roughness:.6,metalness:.54});
for(let i=0;i<17;i++)box(rig,[.020,.18,.030],[1.92,-2.08+i*.24,-.88],ventMaterial);
for(let i=0;i<7;i++)box(rig,[1.45,.026,.025],[-.62,2.55,-.95+i*.18],ventMaterial);
const caseFeet=box(rig,[.55,.08,.55],[-1.15,-2.56,-.95],rubber);
// Rear exhaust frame is part of the example chassis, not an installable kit.
// It shows the real fan mount geometry in the open-case demonstration.
const rearRing=new THREE.Mesh(new THREE.TorusGeometry(.37,.038,10,44),accentMetal);
rearRing.position.set(0,2.35,-.29);rearRing.rotation.x=Math.PI/2;rig.add(rearRing);
const fanHub=new THREE.Mesh(new THREE.CylinderGeometry(.10,.10,.07,24),paintBlack);
fanHub.position.set(0,2.32,-.29);rig.add(fanHub);
for(let i=0;i<7;i++){
 const a=i*Math.PI*2/7;
 const blade=new THREE.Mesh(new THREE.SphereGeometry(.23,12,8),steel);
 blade.position.set(Math.cos(a)*.19,2.33,-.29+Math.sin(a)*.19);
 blade.scale.set(.36,.20,1.20);blade.rotation.y=a;rig.add(blade);
}
for(let i=0;i<7;i++)box(rig,[1.46,.025,.03],[-.11,2.46,-1.02+i*.24],trim);

for(const x of [-1.15,1.15])for(const y of [-2.55,2.55]){
 const foot=box(rig,[.42,.06,.42],[x,y,-1.06],rubber);
 foot.castShadow=false;
}
const cameraCase=new THREE.Vector3(2.28,-1.51,-.1);
const orientationAngles={upright:0,landscape:-Math.PI/2,inverted:Math.PI/2};
let orientation='landscape';
rig.rotation.x=orientationAngles.landscape;
const taskLight=new THREE.PointLight(0xffdfa5,42,11);taskLight.position.set(-4,4,1.8);scene.add(taskLight);
const studioFill=new THREE.PointLight(0xe4f5ff,24,14);studioFill.position.set(4,5,4);scene.add(studioFill);
/* True top-surface target rings; the learner can drag or click the intended location. */
/* Motherboard socket coordinate system (board-local XY plane, +Z is the
   component side). All mounted components are children of this assembly.
   This is an educational socket map for the generic modeled motherboard;
   it is not exact connector geometry of a specific commercial SKU. */
const BOARD_CONNECTORS={
 motherboard:{position:[0,0,0],rotation:[0,0,0]},
 cpu:{position:[-.29,.44,.208],rotation:[0,0,0]},
 ram:{position:[.80,.23,.330],rotation:[0,0,0]},
 storage:{position:[-.56,-.265,.202],rotation:[0,0,0]},
 cooler:{position:[-.29,.44,.550],rotation:[0,0,0]},
 gpu:{position:[-.34,-.74,.468],rotation:[Math.PI/2,0,0]}
};
const CHASSIS_CONNECTORS={
 psu:{position:[.97,-1.79,-.54],rotation:[0,0,0]},
 casefans:{position:[1.43,.03,-.45],rotation:[0,0,0]}
};
const MAT_BOARD_LOCATION=[-3.65,-2.61,-.15];
const CASE_BOARD_LOCATION=[-.40,.35,-.83];
const boardAssembly=new THREE.Group();
boardAssembly.name='Motherboard assembly with real snap connectors';
scene.add(boardAssembly);
boardAssembly.position.set(...MAT_BOARD_LOCATION);
boardAssembly.rotation.x=-Math.PI/2;
/* Shared visible landmarks: generic training motherboard connectors. The same
   anchors drive the click targets and part transforms (no independent guesswork). */
const socketGuides=new THREE.Group();
socketGuides.name='Board sockets: LGA/AM CPU, DIMMs, M.2 and PCIe';
boardAssembly.add(socketGuides);
const socketMetal=new THREE.MeshStandardMaterial({color:0xa4b5b5,metalness:.82,roughness:.32});
const socketPlastic=new THREE.MeshStandardMaterial({color:0x101921,metalness:.26,roughness:.58});
const socketPin=new THREE.MeshStandardMaterial({color:0xbda36c,metalness:.88,roughness:.40});
const highlightPCB=new THREE.MeshStandardMaterial({color:0x2b5d57,metalness:.23,roughness:.69});
function locatorBox(dim,pos,material){
 const m=new THREE.Mesh(new THREE.BoxGeometry(...dim),material);
 m.position.set(...pos);m.receiveShadow=true;socketGuides.add(m);return m;
}
// Reinforced CPU socket seating area and hinged clamp silhouette.
locatorBox([.57,.57,.028],[-.29,.44,.145],socketMetal);
locatorBox([.49,.49,.013],[-.29,.44,.164],socketPlastic);
locatorBox([.42,.42,.008],[-.29,.44,.174],socketMetal);
locatorBox([.054,.054,.011],[-.495,.645,.184],socketPin); // alignment corner
// Four DIMM sockets; configured 2-DIMM build snaps to board slots A2/B2.
for(const x of [.45,.625,.80,.975]){
 locatorBox([.093,1.25,.038],[x,.23,.165],socketPlastic);
 for(const y of [-.41,.88])locatorBox([.118,.065,.060],[x,y,.178],socketMetal);
}
// M.2 drive connects lengthwise on the motherboard, not floating by the PSU.
locatorBox([.79,.18,.021],[-.56,-.265,.156],socketPlastic);
locatorBox([.065,.21,.025],[-.91,-.265,.172],socketMetal);
locatorBox([.032,.032,.018],[-.20,-.265,.180],socketPin);
// PCIe x16 receiving connector, below the CPU socket.
locatorBox([1.59,.115,.062],[-.34,-.74,.171],socketPlastic);
locatorBox([.045,.16,.073],[-1.11,-.74,.186],socketMetal);
const snapTweens=new Map();
const boardLocalIds=new Set(Object.keys(BOARD_CONNECTORS));
function socketParent(id){return boardLocalIds.has(id)?boardAssembly:rig}
function socketPose(id){
 if(id==='ram'&&numRam()===4){
  return {position:[.7125,.23,.330],rotation:[0,0,0]};
 }
 return BOARD_CONNECTORS[id]||CHASSIS_CONNECTORS[id];
}
function socketWorld(id){
 const parent=socketParent(id),pose=socketPose(id);
 parent.updateWorldMatrix(true,false);
 return parent.localToWorld(new THREE.Vector3(...pose.position));
}
function startSnapTween(obj,partId,target,rotation,lift){
 // Invariants FIRST: the component's transform is aligned to the receiver
 // immediately. The optional animation only adjusts its visual scale/tilt.
 // Browser frame throttling must never leave a CPU hovering above its socket.
 obj.position.set(...target);
 const toRotation=new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation));
 const fromRotation=toRotation.clone();
 if(partId==='storage')fromRotation.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),-.30));
 const fromScale=partId==='cpu'?.92:partId==='ram'?.89:.83;
 obj.scale.setScalar(fromScale);
 obj.quaternion.copy(fromRotation);
 snapTweens.set(partId,{obj,fromScale,toScale:1,fromRotation,toRotation,
   start:performance.now(),duration:520,ease:k=>1-Math.pow(1-k,3)});
}
function beginBoardMount(){
 rig.attach(boardAssembly); // Preserve board + CPU + RAM + NVMe + cooler assembly as ONE object.
 const fromPosition=boardAssembly.position.clone(),fromRotation=boardAssembly.quaternion.clone();
 const targetRotation=new THREE.Quaternion();
 snapTweens.set('board-mount',{obj:boardAssembly,fromPosition,
  toPosition:new THREE.Vector3(...CASE_BOARD_LOCATION),fromRotation,toRotation,
  start:performance.now(),duration:1150,ease:k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2});
}
const slots=new Map();
for(const p of parts){
 const size=p.id==='motherboard'?.43:p.id==='casefans'?.28:.20;
 const ring=new THREE.Mesh(new THREE.RingGeometry(size*.72,size,56),
   new THREE.MeshBasicMaterial({color:0x8df7dc,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));
 ring.rotation.x=-Math.PI/2;ring.visible=false;scene.add(ring);slots.set(p.id,ring);
}
const assetCache=new Map(),meshes=new Map(),failure=new Set();
const state={mode:'tutorial',step:0,selected:null,placed:{},boardMounted:false,removed:new Set(),attempts:[],submitted:false,hints:true,hover:null,visited:new Set(),report:null};
const active={loading:0,loaded:0,failed:0,canvasPart:null,down:null,dragged:null};
function snapshot(){try{return JSON.parse(localStorage.getItem('unitlab3d_livebuild_v4')||'null')}catch{return null}}
function numRam(){return Math.max(2,Math.min(4,snapshot()?.parts?.ram?.dimms||2))}
function status(){
 const el=$('#assetsStatus');if(!el)return;
 el.textContent=active.loading
 ?'Loading selected 3D parts · '+active.loading+' pending'
 :active.failed
  ?active.loaded+' loaded · '+active.failed+' unavailable'
  :active.loaded+' detailed parts ready';
 el.title='Meshes are downloaded only when required. Assembly desk stays usable while parts load.';
}
function fetchModel(p){
if(assetCache.has(p.id))return assetCache.get(p.id);
const urls=[p.url];
 if(p.url.includes('raw.githubusercontent.com/brickshow/pc-anatomy/main/public/models/')){
  urls.push('https://cdn.jsdelivr.net/gh/brickshow/pc-anatomy@main/public/models/'+p.filename);
 }
 const attempt=(url)=>new Promise((resolve,reject)=>{
   let settled=false;
   const timeout=setTimeout(()=>{if(!settled){settled=true;reject(new Error('Asset request timed out'))}},14000);
   loader.load(url,glb=>{if(!settled){settled=true;clearTimeout(timeout);resolve(glb.scene)}},
     undefined,error=>{if(!settled){settled=true;clearTimeout(timeout);reject(error)}});
 });
 const promise=(async()=>{let last;for(const url of urls){
    try{return await attempt(url)}catch(e){last=e;console.warn('Trying alternate GLB source',p.id,url,e)}
  }throw last||new Error('Asset unavailable')})();
assetCache.set(p.id,promise);return promise;
}
/* Detailed procedural fallback for every hardware class.
   A GLB replaces the fallback as soon as it loads. The fallback is intentionally
   a generic educational representation, not a manufacturer CAD model. */
function placeholder(p){
 const g=new THREE.Group(),id=p.id;
 const pcb=new THREE.MeshStandardMaterial({color:0x162d2a,metalness:.18,roughness:.75});
 const pcbLight=new THREE.MeshStandardMaterial({color:0x296254,metalness:.31,roughness:.60});
 const black=new THREE.MeshStandardMaterial({color:0x15191d,metalness:.35,roughness:.61});
 const brushed=new THREE.MeshStandardMaterial({color:0x9fa8ac,metalness:.91,roughness:.31});
 const alloy=new THREE.MeshStandardMaterial({color:0x525c65,metalness:.87,roughness:.39});
 const copper=new THREE.MeshStandardMaterial({color:0xb98b4c,metalness:.68,roughness:.43});
 const slotMat=new THREE.MeshStandardMaterial({color:0x222a31,metalness:.30,roughness:.60});
 const pale=new THREE.MeshStandardMaterial({color:0xd2d7d9,metalness:.54,roughness:.48});
 const red=new THREE.MeshStandardMaterial({color:0x98564c,metalness:.40,roughness:.53});
 function disc(parent,rad,height,x,y,z,mat,segments=32){
  const m=new THREE.Mesh(new THREE.CylinderGeometry(rad,rad,height,segments),mat);
  m.rotation.x=Math.PI/2;m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
 }
 function fan(cx,cy,z,r){
  const border=new THREE.Mesh(new THREE.TorusGeometry(r,.055,10,40),alloy);
  border.position.set(cx,cy,z);g.add(border);
  disc(g,r*.70,.02,cx,cy,z-.027,black);
  for(let i=0;i<7;i++){
   const angle=i*Math.PI*2/7,blade=new THREE.Mesh(new THREE.SphereGeometry(r*.32,10,6),brushed);
   blade.position.set(cx+Math.cos(angle)*r*.41,cy+Math.sin(angle)*r*.41,z+.025);
   blade.scale.set(.48,1.5,.09);blade.rotation.z=angle+.63;g.add(blade);
  }
  disc(g,r*.21,.065,cx,cy,z+.079,alloy);
  for(let i=0;i<4;i++){
   const a=(i+.5)*Math.PI/2;
   const mount=new THREE.Mesh(new THREE.SphereGeometry(.045,8,6),pale);
   mount.position.set(cx+Math.cos(a)*r*.9,cy+Math.sin(a)*r*.9,z+.045);g.add(mount);
  }
 }
 if(id==='motherboard'){
  const w=2.58,h=2.80;
  box(g,[w,h,.085],[0,0,0],pcb);
  // Fine traces + printed copper pads reveal a physical PCB rather than a flat slab.
  for(let i=0;i<27;i++){
   const x=-1.16+(i*57%218)/100,y=-1.24+(i*97%242)/100;
   box(g,[.19+(i%4)*.06,.009,.005],[x,y,.049],i%4===0?copper:pcbLight);
  }
  // CPU LGA/AM socket base without a processor inside.
  box(g,[.64,.66,.050],[-.29,.44,.079],alloy);
  box(g,[.55,.56,.018],[-.29,.44,.112],slotMat);
  box(g,[.36,.37,.018],[-.29,.44,.124],brushed);
  box(g,[.08,.08,.014],[-.50,.66,.128],pale);
  // Four DIMM slots along the board edge.
  for(let i=0;i<4;i++){
   const x=.45+i*.175;
   box(g,[.084,1.49,.105],[x,.23,.107],black);
   box(g,[.105,.09,.13],[x,1.02,.12],pale);
   box(g,[.105,.09,.13],[x,-.57,.12],pale);
  }
  // Two full-length PCIe expansion slots + one x1.
  for(let i=0;i<2;i++){
   const y=-.60-i*.34;
   box(g,[1.64,.125,.115],[-.37,y,.112],i?alloy:black);
   box(g,[.03,.16,.14],[-1.14,y,.12],pale);
  }
  box(g,[.81,.15,.045],[-.56,-.265,.094],slotMat);
  // Power / chipset heatsink fins.
  box(g,[.40,1.16,.14],[-.99,.53,.112],alloy);
  box(g,[.93,.30,.18],[-.49,1.13,.13],alloy);
  box(g,[.55,.45,.14],[.57,-1.06,.12],alloy);
  for(let i=0;i<9;i++){
   box(g,[.035,1.10,.043],[-1.17+i*.035,.55,.206],black);
  }
  // Power connectors and capacitors.
  box(g,[.16,.56,.18],[1.19,.62,.116],black);
  box(g,[.34,.17,.22],[-1.05,1.29,.14],brushed);
  for(let i=0;i<19;i++){
   const x=-1.11+(i*19%85)/100,y=-.20+(i*37%111)/100;
   disc(g,.031,.060,x,y,.12,i%5===0?copper:black,10);
  }
  for(let i=0;i<7;i++){const x=-.94+i*.29;box(g,[.07,.045,.04],[x,-1.34,.067],copper)}
 }else if(id==='cpu'){
  box(g,[.46,.46,.03],[0,0,0],pcbLight);
  box(g,[.38,.38,.048],[0,0,.035],alloy);
  box(g,[.33,.33,.009],[0,0,.066],brushed);
  for(let i=0;i<7;i++)for(let j=0;j<7;j++)
   box(g,[.017,.017,.006],[-.17+i*.055,-.17+j*.055,-.020],copper);
  box(g,[.042,.042,.009],[-.192,.192,.065],pale);
 }else if(id==='ram'){
  box(g,[.12,1.16,.30],[0,0,0],pcb);
  box(g,[.145,1.05,.26],[0,.025,.025],black);
  for(let i=0;i<8;i++)box(g,[.078,.092,.015],[0,-.44+i*.129,.171],alloy);
  for(let i=0;i<10;i++)box(g,[.03,.046,.028],[0,-.50+i*.107,-.16],copper);
  box(g,[.16,.08,.31],[0,.49,.025],alloy);
 }else if(id==='storage'){
  box(g,[.78,.24,.035],[0,0,0],pcb);
  for(let i=0;i<4;i++)box(g,[.13,.15,.018],[-.22+i*.15,.02,.026],black);
  box(g,[.12,.18,.008],[.27,0,.028],alloy);
  for(let i=0;i<8;i++)box(g,[.018,.09,.013],[-.32+i*.02,-.10,-.01],copper);
  disc(g,.025,.012,.36,0,.02,brushed,12);
 }else if(id==='cooler'){
  box(g,[.80,.80,.30],[0,0,-.16],alloy);
  for(let i=0;i<20;i++)box(g,[.78,.76,.008],[0,0,-.33+i*.020],i%3?brushed:alloy);
  for(const x of [-.29,.29])for(const y of [-.29,.29])disc(g,.025,.41,x,y,-.26,copper,12);
  box(g,[.88,.88,.11],[0,0,.19],black);
  fan(0,0,.29,.32);
 }else if(id==='psu'){
  const [w,h,d]=p.dims;
  box(g,[w,h,d],[0,0,0],black);
  for(const x of [-w*.47,w*.47])box(g,[.025,h,.03],[x,0,d*.5],alloy);
  fan(0,0,d*.5+.05,.31);
  for(let i=0;i<7;i++)box(g,[.035,.03,.09],[w*.5-.02,-h*.38+i*.11,-d*.33],pale);
  box(g,[.17,.13,.018],[-w*.27,-h*.34,d*.5+.015],red);
 }else if(id==='gpu'){
  const [w,h,d]=p.dims;
  box(g,[w,h,d],[0,0,0],black);
  box(g,[w*.95,h*.89,.075],[0,0,d*.5+.04],alloy);
  for(const x of [-.68,0,.68])fan(x,0,d*.5+.105,.23);
  box(g,[w*.72,.028,.05],[0,-h*.52,-d*.12],copper);
  box(g,[.11,h,.07],[-w*.50,0,0],pale);
  for(let i=0;i<12;i++)box(g,[.015,.04,.02],[-.48+i*.07,-h*.55,-d*.10],copper);
 }else if(id==='casefans'){
  box(g,[.79,2.56,.13],[0,0,0],black);
  for(let i=0;i<3;i++){
   const cy=-.83+i*.83;
   box(g,[.79,.79,.09],[0,cy,.04],alloy);
   fan(0,cy,.15,.325);
  }
 }
 return g;
}
/* Scale models by visible footprint rather than always by their thinnest
   bounding-box axis. Real motherboard GLBs have tall heatsinks/ports; using
   a 0.12-thick board envelope made the entire motherboard look microscopic. */
function normalize(model,dim,id){
 const clone=model.clone(true);
 const envelope={
   motherboard:[2.60,2.78,.92],cpu:[.46,.46,.22],
   ram:[.17,1.17,.38],storage:[.78,.24,.16],
   cooler:[.88,.88,.76],gpu:[2.20,.61,.78],
   psu:[1.15,.89,1.09],casefans:[.86,2.64,.52]
 }[id]||dim;
 let best={score:-Infinity,scale:0,rotation:[0,0,0],center:new THREE.Vector3(),measured:null};
 const quarter=Math.PI/2;
 const orientations=[
  [0,0,0],[quarter,0,0],[0,quarter,0],[0,0,quarter],
  [quarter,quarter,0],[quarter,0,quarter],[0,quarter,quarter],
  [Math.PI,0,0],[0,Math.PI,0],[0,0,Math.PI]
 ];
 for(const angles of orientations){
   clone.rotation.set(...angles);clone.position.set(0,0,0);clone.updateMatrixWorld(true);
   const bounds=new THREE.Box3().setFromObject(clone),size=bounds.getSize(new THREE.Vector3());
   if(size.length()<.001||![size.x,size.y,size.z].every(Number.isFinite))continue;
   const widthRatio=envelope[0]/Math.max(.005,size.x);
   const heightRatio=envelope[1]/Math.max(.005,size.y);
   const depthRatio=envelope[2]/Math.max(.005,size.z);
   const scale=Math.min(widthRatio,heightRatio,depthRatio);
   const fillX=size.x*scale/envelope[0],fillY=size.y*scale/envelope[1];
   // The visually largest front-facing footprint wins; extra heatsinks
   // can extend behind the motherboard without shrinking the whole PCB.
   const score=fillX*fillY + .04*Math.min(fillX,fillY);
   if(score>best.score)best={score,scale,rotation:angles,center:bounds.getCenter(new THREE.Vector3()),measured:size.clone()};
 }
 if(!(best.scale>0))throw Error('3D model had invalid bounds: '+id);
 clone.rotation.set(...best.rotation);
 clone.position.copy(best.center).multiplyScalar(-1);
 const grp=new THREE.Group();grp.scale.setScalar(best.scale);grp.add(clone);
 grp.traverse(o=>{o.userData.partId=id;if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
 if(!window.__unitlabFit)window.__unitlabFit={};
 window.__unitlabFit[id]={original:best.measured.toArray().map(v=>+v.toFixed(3)),
  result:best.measured.toArray().map(v=>+(v*best.scale).toFixed(3)),
  target:envelope,scale:+best.scale.toFixed(6),rotation:best.rotation};
 return grp;
}
function updateRam(){
const holder=meshes.get('ram');if(!holder)return;
const n=numRam(),p=byId.ram;
const slots=n===4?[.45,.625,.80,.975]:[.625,.975];
const mid=slots.reduce((a,b)=>a+b,0)/slots.length;
holder.position.x=mid;
holder.clear();
for(const [i,x] of slots.entries()){
const stick=new THREE.Group();stick.position.x=x-mid;holder.add(stick);
stick.add(placeholder(p));
Promise.resolve(fetchModel(p)).then(original=>{
if(!stick.parent)return;
const m=normalize(original,[.11,1.15,.22],'ram');stick.clear();stick.add(m);
}).catch(()=>{});
}
}
function ensureMesh(id){
if(meshes.has(id))return meshes.get(id);
const p=byId[id],group=new THREE.Group();group.userData.partId=id;group.position.set(0,-20,0);group.visible=false;group.add(placeholder(p));scene.add(group);meshes.set(id,group);
active.loading++;status();
fetchModel(p).then(model=>{
const child=normalize(model,p.dims,id);
 group.clear();
 if(id==='motherboard'){
  // A visible PCB plate anchors the real imported chips/connectors.
  // Generic pedagogical outline; not a specific manufacturer's board model.
  const baseMaterial=new THREE.MeshStandardMaterial({color:0x14312f,metalness:.20,roughness:.72});
  box(group,[2.58,2.80,.045],[0,0,-.035],baseMaterial);
  const edgeMaterial=new THREE.MeshStandardMaterial({color:0x698f82,metalness:.65,roughness:.55});
  const edge=box(group,[2.59,.025,.070],[0,1.38,-.02],edgeMaterial);
  edge.castShadow=false;
  for(let i=0;i<4;i++){
    const pin=new THREE.Mesh(new THREE.CylinderGeometry(.028,.028,.012,12),edgeMaterial);
    pin.rotation.x=Math.PI/2;
    pin.position.set(i%2?1.19:-1.19,i<2?1.30:-1.30,.015);
    group.add(pin);
  }
 }
 if(id==='motherboard'){
  // The source's board chips sit on the reverse side of its default axis.
  // Flatten the imported height and lift connectors above our dark PCB,
  // keeping the motherboard's real visible surface and proportions.
  child.scale.z=.29;
  child.position.z=.08;
 }
 group.add(child);active.loaded++;if(id==='ram')updateRam();
}).catch(error=>{
 console.warn('GLB unavailable: '+id,error);
 active.failed++;failure.add(id);
 const msg=$('#meshNotice');
 if(msg){
   msg.hidden=false;msg.textContent=p.name+' could not be downloaded. The assembly desk remains available, but this part is shown using a generic procedural learning model. Check your connection and reload to retry.';
 }
}).finally(()=>{active.loading--;status()});
return group;
}
/* Attach hardware to real socket anchors on ONE motherboard assembly.
   This prevents CPU/RAM/SSD hovering near a board when it is moved or flipped. */
const preassemblyIds=['motherboard','cpu','ram','storage','cooler'];
function inPreassembly(id){
 return state.mode!=='disassembly'&&!state.boardMounted&&preassemblyIds.includes(id);
}
function boardIsPrepared(){return preassemblyIds.every(id=>state.placed[id]===id)}
function activeZone(p){return socketWorld(p.id).toArray()}
function markInstalled(id,where,{animate=false}={}){
 const obj=ensureMesh(id),target=socketPose(id);
 const parent=socketParent(id);
 if(obj.parent!==parent)parent.add(obj);
 obj.visible=true;obj.scale.setScalar(1);
 if(id==='motherboard'){
  obj.position.set(0,0,0);obj.rotation.set(0,0,0);
  // The board itself is the anchor for every connected component.
 }else if(animate){
  startSnapTween(obj,id,target.position,target.rotation,id==='gpu'?.80:id==='cooler'?.67:id==='psu'?.64:.52);
 }else{
  obj.position.set(...target.position);
  obj.rotation.set(...target.rotation);
 }
 if(id==='ram')updateRam();
}
function mountPreassembledBoard(){
 if(state.mode==='disassembly'||state.boardMounted)return;
 if(!boardIsPrepared()){
  $('#stepInstruction').textContent='First install the CPU, memory, M.2 SSD and cooler on the ESD mat. Then mount the populated board into the case.';
  return;
 }
 state.boardMounted=true;
 // The populated motherboard remains a single parent hierarchy during movement.
 beginBoardMount();
 const message=$('#placementFeedback');
 if(message)message.textContent='Moving the complete motherboard assembly onto the case standoffs…';
 cameraView([6.7,6.8,9.0],[1.4,-1.3,-.1]);
 selectPart(sequence[state.step]||'psu');drawStatus();highlights();
}
function returnToRack(id){
 const obj=ensureMesh(id);snapTweens.delete(id);
 scene.add(obj);obj.position.set(0,-20,0);
 obj.rotation.set(0,0,0);obj.scale.setScalar(1);obj.visible=false;
}
function rackDrop(){return false}
function worldAtPointer(event,id=state.selected){
 const rect=canvas.getBoundingClientRect();
 const x=(event.clientX-rect.left)/rect.width*2-1;
 const y=-(event.clientY-rect.top)/rect.height*2+1;
 ray.setFromCamera(new THREE.Vector2(x,y),camera);
 const socket=id&&socketPose(id)?socketWorld(id):new THREE.Vector3(-3.65,-2.4,0);
 const parent=id?socketParent(id):boardAssembly;
 parent.updateWorldMatrix(true,false);
 const normal=new THREE.Vector3(0,0,1).applyQuaternion(parent.getWorldQuaternion(new THREE.Quaternion())).normalize();
 const plane=new THREE.Plane().setFromNormalAndCoplanarPoint(normal,socket);
 return ray.ray.intersectPlane(plane,new THREE.Vector3());
}
/* Hardware tray: lightweight accessible card previews. Importing eight more
   model-viewer instances previously doubled the large GLB downloads on startup.
   The REAL GLB is loaded in the assembly scene on part selection. */
function renderShelf(){
 const shelves=$('#shelves');shelves.replaceChildren();
 const trayOrder=['cpu','cooler','ram','storage','gpu','psu','casefans','motherboard'];
 for(const id of trayOrder){
  const p=byId[id];
  const button=document.createElement('button');
  button.type='button';button.className='inventory';button.dataset.part=p.id;
  button.setAttribute('aria-label','Select '+p.name+' for 3D installation');
  button.draggable=true;
  const icon=document.createElement('span');icon.className='inventory-icon';
  icon.setAttribute('aria-hidden','true');
  const glyph=document.createElement('span');glyph.className='hardware-glyph';
  const art={
   cpu:'<rect x="32" y="9" width="56" height="64" rx="6" fill="#aeb9c4" stroke="#e1edef" stroke-width="3"/><rect x="39" y="17" width="42" height="48" rx="2" fill="#d3d9d9"/><text x="60" y="44" fill="#47626e" font-size="10" text-anchor="middle">CPU</text>',
   motherboard:'<rect x="23" y="4" width="74" height="76" rx="3" fill="#194e48" stroke="#499880" stroke-width="3"/><rect x="36" y="19" width="29" height="27" fill="#b5c5c4" stroke="#4b626a" stroke-width="3"/><path d="M73 12v48m8-48v48M28 56h39M28 67h50" stroke="#0a202b" stroke-width="6"/><path d="M23 11h10m56 41h8" stroke="#b8a77a" stroke-width="3"/>',
   cooler:'<rect x="24" y="9" width="73" height="65" fill="#59636a" stroke="#adc1c4" stroke-width="3"/><path d="M26 18h69M26 24h69M26 65h69" stroke="#bdc3c9" stroke-width="2"/><circle cx="60" cy="42" r="24" fill="#15232b" stroke="#7f95a1" stroke-width="4"/><path d="M60 19v46M38 42h44M45 27l31 31M76 27 45 58" stroke="#566c78" stroke-width="7"/><circle cx="60" cy="42" r="7" fill="#273b47"/>',
   ram:'<g transform="rotate(-7 60 42)"><rect x="7" y="18" width="106" height="18" rx="3" fill="#304347" stroke="#718e92" stroke-width="2"/><path d="M16 35v5h90v-5" stroke="#bd9655" stroke-width="4"/><rect x="10" y="45" width="100" height="18" rx="3" fill="#26333d" stroke="#77969d" stroke-width="2"/><path d="M22 47v14m19-14v14m19-14v14m19-14v14m19-14v14" stroke="#526a73" stroke-width="6"/></g>',
   storage:'<g transform="rotate(-10 60 42)"><rect x="5" y="28" width="110" height="27" rx="3" fill="#1c594d" stroke="#76af91" stroke-width="2"/><rect x="18" y="32" width="26" height="18" fill="#19232a"/><rect x="49" y="32" width="25" height="18" fill="#19232a"/><rect x="79" y="32" width="22" height="18" fill="#19232a"/><circle cx="109" cy="41" r="3" fill="#cbd2c9"/></g>',
   gpu:'<rect x="4" y="23" width="112" height="43" rx="5" fill="#27323c" stroke="#7c98a1" stroke-width="3"/><circle cx="38" cy="44" r="18" fill="#131e28" stroke="#92a8b0" stroke-width="3"/><circle cx="82" cy="44" r="18" fill="#15202a" stroke="#92a8b0" stroke-width="3"/><path d="M38 28v32M22 44h32M82 28v32M66 44h32" stroke="#607987" stroke-width="5"/><circle cx="38" cy="44" r="5" fill="#1d2b33"/><circle cx="82" cy="44" r="5" fill="#1d2b33"/>',
   psu:'<rect x="27" y="6" width="68" height="70" rx="6" fill="#303942" stroke="#98a6b1" stroke-width="3"/><circle cx="61" cy="42" r="26" fill="#0f1c28" stroke="#a2b8ba" stroke-width="4"/><path d="M36 42h50M61 17v50M42 23l39 38M80 23 42 61" stroke="#688089" stroke-width="3"/><circle cx="61" cy="42" r="5" fill="#45585f"/>',
   casefans:'<rect x="27" y="8" width="68" height="68" rx="5" fill="#223844" stroke="#83bbc0" stroke-width="3"/><circle cx="61" cy="42" r="27" fill="#0d1c27" stroke="#83adb7" stroke-width="4"/><path d="M61 18v47M38 42h46M44 25l34 33M78 25 44 58" stroke="#50717c" stroke-width="7"/><circle cx="61" cy="42" r="7" fill="#213943"/>'
  };
  glyph.innerHTML='<svg viewBox="0 0 120 84" aria-hidden="true">'+art[p.id]+'</svg>';
  icon.appendChild(glyph);
  const wrapper=document.createElement('span');wrapper.className='inventory-text';
  const title=document.createElement('b'),subtitle=document.createElement('small');
  title.textContent=p.name;subtitle.textContent='Select and place';
  wrapper.append(title,subtitle);button.append(icon,wrapper);
  button.addEventListener('click',()=>selectPart(p.id));
  button.addEventListener('dragstart',e=>{
    selectPart(p.id);active.dragged=p.id;
    e.dataTransfer.setData('text/plain',p.id);e.dataTransfer.effectAllowed='move';
  });
  button.addEventListener('dragend',()=>{active.dragged=null});
  shelves.appendChild(button);
 }
 renderShelfStyles();
}
function renderShelfStyles(){
for(const el of $$('.inventory')){
const id=el.dataset.part;
el.classList.toggle('active',state.selected===id);
el.classList.toggle('loaded',state.mode==='disassembly'?state.removed.has(id):!!state.placed[id]);
el.classList.toggle('ghost',state.mode==='tutorial'&&state.hints&&sequence[state.step]===id);
el.disabled=state.submitted;
}
}
const preview=$('#preview3D');preview.addEventListener('load',()=>{$('#previewPlaceholder').hidden=true;preview.style.display='block'});
preview.addEventListener('error',()=>{$('#previewPlaceholder').hidden=false;preview.style.display='none'});
function inspect(id){const p=byId[id];if(!p)return;
$('#inspectedName').textContent=p.name;$('#inspectedInfo').textContent=p.desc;$('#safety').textContent=p.safety;
$('#inspectedChips').textContent='Textured GLB · '+(id==='ram'?numRam()+' DIMM modules':'360° preview');
const previewPlaceholder=$('#previewPlaceholder');
 const card=document.querySelector('.inventory[data-part="'+id+'"] .hardware-glyph svg');
 previewPlaceholder.hidden=false;
 previewPlaceholder.innerHTML=card?card.outerHTML:'Hardware preview loading';
 preview.style.display='none';
 // The 3D canvas itself already downloads the licensed GLB for inspection.
 // Do not download the same large file a second time into model-viewer.
 preview.removeAttribute('src');
}
function selectPart(id){
 if(!byId[id])return;
 state.selected=id;inspect(id);
 // Loading happens on demand. A missing remote file must not block the lab.
 if(!failure.has(id))ensureMesh(id);
 renderShelfStyles();highlights();
}
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
function project(p){
const v=new THREE.Vector3(...activeZone(p)).project(camera),r=canvas.getBoundingClientRect();
return {x:(v.x+1)/2*r.width,y:(1-v.y)/2*r.height}
}
function nearestZone(e){
 const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;
 // When installing a selected part, the user must actually reach ITS
 // projected socket (not just click anywhere on the motherboard).
 const radius=Math.min(76,Math.max(39,rect.width*.064));
 const candidate=state.mode!=='disassembly'&&state.selected&&byId[state.selected]&&
                 state.placed[state.selected]!==state.selected ? [byId[state.selected]] : parts;
 let nearest='workspace',distance=Infinity;
 for(const p of candidate){
   const point=project(p),d=Math.hypot(x-point.x,y-point.y);
   if(d<distance){nearest=p.id;distance=d}
 }
 return distance<=radius?nearest:'workspace';
}
function meshPick(e){
const rect=canvas.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
ray.setFromCamera(mouse,camera);
const hits=ray.intersectObjects([...meshes.values()].filter(m=>m.visible),true);
for(const hit of hits){let o=hit.object;while(o&&!o.userData.partId)o=o.parent;if(o?.userData.partId)return o.userData.partId}
return null;
}
function highlights(){
 const next=sequence[state.step];
 const focus=state.selected||(state.mode==='tutorial'?next:null);
 for(const p of parts){
   const ring=slots.get(p.id),selected=state.mode==='tutorial'?next===p.id:focus===p.id;
   const removed=state.mode==='disassembly'?state.removed.has(p.id):state.placed[p.id]===p.id;
   ring.visible=selected&&!removed&&!state.submitted;
   // Both ring position and ring plane are driven by the same socket parent
   // as the physical part, even while the board/case is being rotated.
   ring.position.copy(socketWorld(p.id));
   const parent=socketParent(p.id);
   ring.quaternion.copy(parent.getWorldQuaternion(new THREE.Quaternion()));
   ring.material.opacity=state.mode==='tutorial'&&state.hints?.85:.62;
   ring.material.color.set(selected?0x66fce4:0x8ecbd8);
   ring.scale.setScalar(selected?1.10:1);
 }
 $('#hoverName').textContent=focus&&byId[focus]
  ?'Place '+byId[focus].name+' on the glowing socket · Scroll to inspect'
  :'Rotate workstation · Zoom onto connector · Choose a part';
}
const successCopy={
 motherboard:'Motherboard aligned on the anti-static mat. Identify the CPU socket before installation.',
 cpu:'CPU centered over the socket and lowered into its seating area. Check the corner marker and retention mechanism.',
 ram:'Memory snapped into the motherboard DIMM positions. A2/B2 placement is illustrated for a two-stick kit.',
 storage:'M.2 SSD edge inserted at the illustrated M.2 connector and lowered to its standoff.',
 cooler:'Cooler base placed directly above the installed CPU, ready for appropriate fastening.',
 psu:'Power supply aligned with the case PSU bay.',
 gpu:'Graphics card seated into the illustrated PCIe x16 connector, with the bracket facing the case edge.',
 casefans:'Case-fan frame positioned on the chassis mounting area.'
};
function placementMessage(message){const el=$('#placementFeedback');if(el)el.textContent=message}
function focusConnector(id){
 if(!id||!socketPose(id))return;
 const target=socketWorld(id);
 const parent=socketParent(id);
 const normal=new THREE.Vector3(0,0,1).applyQuaternion(parent.getWorldQuaternion(new THREE.Quaternion()));
 const distance=id==='cpu'?2.6:id==='storage'||id==='ram'?3.2:4.5;
 const offset=normal.multiplyScalar(distance).add(new THREE.Vector3(1.05,1.2,1.55));
 camera.position.copy(target.clone().add(offset));
 controls.target.copy(target);controls.update();
}
function install(id,slot){
 if(!byId[id]||state.submitted||state.mode==='disassembly'||state.placed[id]===id)return;
 if(slot!==id){
  if(state.mode==='assembly')state.attempts.push({id,slot,kind:'wrong-slot',time:Date.now()});
  placementMessage('Not aligned. Place '+byId[id].name+' on its glowing connector, not an adjacent location.');
  $('#stepInstruction').textContent='Move to the highlighted '+byId[id].name+' socket. The component will not install at an incorrect location.';
  return;
 }
 if(id!=='motherboard'&&preassemblyIds.includes(id)&&state.placed.motherboard!=='motherboard'){
  if(state.mode==='assembly')state.attempts.push({id,slot,kind:'out-of-sequence',time:Date.now()});
  placementMessage('Place the motherboard on the anti-static mat first.');return;
 }
 if(id==='cooler'&&state.placed.cpu!=='cpu'){
  if(state.mode==='assembly')state.attempts.push({id,slot,kind:'out-of-sequence',time:Date.now()});
  placementMessage('The CPU must be seated before installing its cooler.');return;
 }
 if(!state.boardMounted&&!preassemblyIds.includes(id)){
  if(state.mode==='assembly')state.attempts.push({id,slot,kind:'out-of-sequence',time:Date.now()});
  placementMessage('Complete motherboard preparation, then move the populated board into the case.');
  return;
 }
 if(state.mode==='tutorial'){
  const expected=sequence[state.step];
  if(id!==expected){
   placementMessage('Next required part: '+(byId[expected]?.name||'assembly complete')+'.');
   return;
  }
  state.placed[id]=id;state.step++;
 }else{
  const expected=sequence.find(key=>state.placed[key]!==key);
  state.attempts.push({id,slot,kind:id===expected?'correct':'out-of-sequence',time:Date.now()});
  state.placed[id]=id;
  state.step=sequence.filter(key=>state.placed[key]===key).length;
 }
 markInstalled(id,id,{animate:id!=='motherboard'});
 placementMessage(successCopy[id]||'Component aligned and installed in its receiving slot.');
 selectPart(state.mode==='tutorial'?(sequence[state.step]||id):id);
 drawStatus();
 if(state.mode==='tutorial'&&state.step>0&&state.step<5){
  focusConnector(sequence[state.step]);
 }else if(state.mode==='tutorial'&&state.step===5){
  cameraView([4.2,6.7,9.0],[-1.0,-2.1,0]);
 }
}
function remove(id){
 if(state.mode!=='disassembly'||state.submitted||!byId[id]||state.removed.has(id))return;
 const expected=reverse.find(key=>!state.removed.has(key));
 if(id!==expected){
  state.attempts.push({id,slot:'tray',kind:'out-of-sequence',time:Date.now()});
  placementMessage('Removal order: take out '+byId[expected].name+' before '+byId[id].name+'.');
  return;
 }
 state.attempts.push({id,slot:'tray',kind:'correct',time:Date.now()});
 state.removed.add(id);state.step=state.removed.size;
 const obj=ensureMesh(id),fromPosition=obj.position.clone();
 const lift=.66;
 snapTweens.set('remove-'+id,{obj,fromPosition,toPosition:fromPosition.clone().add(new THREE.Vector3(0,0,lift)),
    start:performance.now(),duration:530,ease:k=>k*k*(3-2*k),
    onComplete:()=>{returnToRack(id);if(id==='motherboard')socketGuides.visible=false}});
 placementMessage(byId[id].name+' lifted clear of its slot. '+(state.step<reverse.length?'Next: '+byId[reverse[state.step]].name+'.':'Disassembly complete.'));
 selectPart(reverse[state.step]||id);drawStatus();
}
function drawStatus(){
 const done=state.mode==='disassembly'?state.removed.size:sequence.filter(id=>state.placed[id]===id).length;
 $('#modeLabel').textContent={tutorial:'GUIDED ASSEMBLY',assembly:'FREE ASSEMBLY',disassembly:'DISASSEMBLY'}[state.mode];
 $('#modeKicker').textContent=state.mode==='tutorial'?'STEP-BY-STEP INSTRUCTIONS':state.mode==='assembly'?'INDEPENDENT ASSEMBLY':'INDEPENDENT DISASSEMBLY';
 $('#progressFill').style.width=(done/sequence.length*100)+'%';
 $('#progressText').textContent=done+' of '+sequence.length+(state.mode==='disassembly'?' components removed':' components installed');
 $('#hints').disabled=state.mode!=='tutorial';
 $('#hints').checked=state.mode==='tutorial'&&state.hints;
 const atMount=state.mode!=='disassembly'&&!state.boardMounted&&boardIsPrepared();
 const next=state.mode==='disassembly'?byId[reverse.find(x=>!state.removed.has(x))]:byId[sequence[state.step]];
 const stepIdx=Math.min(done+1,sequence.length);
 $('#stepNumber').textContent=atMount?'MOTHERBOARD MOUNT':stepIdx+' / '+sequence.length;
 const checklists={
  motherboard:['Find the CPU socket and alignment marker','Identify the DDR DIMM slots','Locate the M.2 NVMe socket','Identify 24-pin and CPU power connectors'],
  cpu:['Check the processor socket type','Align the corner/triangle marker','Lower the CPU without force','Secure the socket retention arm'],
  ram:['Confirm DDR generation is correct','Identify primary DIMM slots','Align the notch before seating','Check both retention clips'],
  storage:['Locate the proper M.2 socket','Check 2280 clearance and mounting','Insert at the specified angle','Secure the SSD with the correct latch/screw'],
  cooler:['Check the cooler mounting kit','Use appropriate thermal interface','Secure mounting screws evenly','Connect the CPU_FAN header'],
  psu:['Confirm PSU wattage and connectors','Orient the PSU fan for airflow','Secure the PSU to the chassis','Route the ATX/EPS power cables'],
  gpu:['Use the correct PCIe x16 slot','Remove the matching rear slot cover','Seat the GPU until latched','Secure it and connect GPU power'],
  casefans:['Identify intake and exhaust direction','Mount fans to the case frame','Connect system-fan headers','Check cable clearance and airflow']
 };
 const currentId=atMount?'motherboard':next?.id;
 const badge=$('#stepBadge');if(badge)badge.textContent=atMount?'↪':String(stepIdx);
 const list=$('#stepChecklist');
 if(list){
   list.replaceChildren();
   const lines=atMount?
      ['Check matching motherboard standoff locations','Align rear I/O with the chassis opening','Lower the board carefully onto standoffs','Fasten with approved screws, without overtightening']:
      (checklists[currentId]||['Confirm part orientation','Follow your teacher’s safety instructions']);
   for(const line of lines){const li=document.createElement('li');li.textContent=line;list.appendChild(li)}
 }

 if(atMount){
   $('#stepHeading').textContent='Install the prepared motherboard';
   $('#stepInstruction').textContent='The CPU, RAM, NVMe SSD and cooler are ready. Move the assembled motherboard from the ESD mat into the horizontal case, aligned to the standoffs.';
 }else if(state.mode==='tutorial'){
   $('#stepHeading').textContent=next?({motherboard:'Prepare the motherboard',cpu:'Install the CPU',ram:'Seat the RAM sticks',storage:'Fit the NVMe SSD',cooler:'Install CPU cooling',psu:'Install the power supply',gpu:'Install the graphics card',casefans:'Install case fans'}[next.id]):'Guided assembly complete';
   $('#stepInstruction').textContent=next?('Select '+next.name+' from the Parts Tray. Place it onto the highlighted '+(inPreassembly(next.id)?'ESD-mat / motherboard':'PC case')+' mounting area. '+next.safety):'All eight component groups are installed. You can restart or try Free Assembly.';
 }else if(state.mode==='disassembly'){
   $('#stepHeading').textContent=next?'Remove '+next.name:'Disassembly complete';
   $('#stepInstruction').textContent=next?'Select the component, then tap the Removed Parts Tray to take it out. Work from external case parts inward. Mistakes in the order are recorded only in your local practice log.':'You have removed every modeled component.';
 }else{
   $('#stepHeading').textContent='Assemble without hints';
   $('#stepInstruction').textContent=state.submitted?'Review your local practice result below.':'Prepare parts on the ESD mat, mount the completed motherboard, then install the remaining case components. Hardware selection and order errors are recorded for formative feedback.';
 }
 const readyToMount=atMount;
 $('#mountBoardBtn').hidden=!readyToMount;
 $('#removeTray').hidden=state.mode!=='disassembly';
 $('#removeSelectedBtn').hidden=state.mode!=='disassembly'||state.submitted;
 $('#removeSelectedBtn').disabled=state.removed.size===sequence.length;
 $('#submitBtn').hidden=state.mode==='tutorial'||state.submitted;
 $('#againBtn').hidden=!state.submitted;
 $('#csvBtn').hidden=!state.submitted;
 $('#stepBackBtn').disabled=done===0;
 $('#stepNextBtn').disabled=done>=sequence.length;
 $('#stepNextBtn').textContent=atMount?'Show motherboard placement →':state.mode==='disassembly'?'Show removal target →':'Show installation target →';
 renderShelfStyles();
 highlights();
}
function report(){
const rows=parts.map(p=>{
const tries=state.attempts.filter(a=>a.id===p.id);
const done=state.mode==='disassembly'?state.removed.has(p.id):state.placed[p.id]===p.id;
return {id:p.id,name:p.name,done,attempts:tries.length,first:tries[0]?.kind==='correct',wrong:tries.filter(x=>x.kind==='wrong-slot').length,order:tries.filter(x=>x.kind==='out-of-sequence').length};
});
const wrong=rows.reduce((n,x)=>n+x.wrong,0),order=rows.reduce((n,x)=>n+x.order,0),missing=rows.filter(x=>!x.done).length,corrected=rows.filter(x=>x.done&&!x.first).length;
return {grade:Math.max(0,100-8*wrong-6*order-10*missing-2*corrected),rows,wrong,order,missing,corrected,mode:state.mode,student:user,date:new Date().toISOString()};
}
function submit(){
if(state.submitted||state.mode==='tutorial')return;
state.submitted=true;state.report=report();const r=state.report;
const key='unitlab3d_practice_reports_'+user;let list=[];try{list=JSON.parse(localStorage.getItem(key)||'[]')}catch{}
list.push(r);localStorage.setItem(key,JSON.stringify(list.slice(-30)));
const div=document.createElement('div');div.className='result';div.innerHTML='<div class="eyebrow">PRACTICE GRADE / LOCAL ONLY</div><h3>'+r.grade+' / 100</h3><p class="tiny">Wrong slots: '+r.wrong+' · Wrong sequence: '+r.order+' · Missing: '+r.missing+' · Not right on first attempt: '+r.corrected+'</p>'+
'<table><thead><tr><th>Component</th><th>Final</th><th>First try</th><th>Attempts</th></tr></thead><tbody>'+r.rows.map(p=>'<tr><td>'+p.name+'</td><td>'+(p.done?'Done':'Missing')+'</td><td>'+(p.first?'Yes':'No')+'</td><td>'+p.attempts+'</td></tr>').join('')+'</tbody></table><p class="tiny">Mistakes remain counted even if you corrected them later. Not a validated/adopted research instrument.</p>';
$('#result').replaceChildren(div);drawStatus();highlights();
}
function download(){
const r=state.report;if(!r)return;const csvRows=[['UnitLab 3D Performance',r.mode,r.date],['Student demo code',r.student],['Practice grade',r.grade],['Wrong slots',r.wrong],['Sequence errors',r.order],[],['Part','Completed','Correct on first attempt','Attempts','Wrong slots','Sequence errors'],...r.rows.map(p=>[p.name,p.done,p.first,p.attempts,p.wrong,p.order])];
const text='\ufeff'+csvRows.map(row=>row.map(a=>'"'+String(a??'').replaceAll('"','""')+'"').join(',')).join('\r\n');
const url=URL.createObjectURL(new Blob([text],{type:'text/csv'})),link=document.createElement('a');link.href=url;link.download='UnitLab3D_'+r.mode+'_performance.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function reset(mode){
 snapTweens.clear();socketGuides.visible=true;
 state.mode=mode;state.step=0;state.selected=null;state.placed={};
 state.boardMounted=mode==='disassembly';state.removed.clear();
 state.attempts=[];state.submitted=false;state.report=null;state.hover=null;
 if(typeof exploded!=='undefined'){
  $('#explodeViewBtn').setAttribute('aria-pressed','false');
  $('#explodeViewBtn').classList.remove('selected');exploded=false;
 }
 $('#result').replaceChildren();
 $$('[data-mode]').forEach(b=>{
  const selected=b.dataset.mode===mode;b.classList.toggle('active',selected);
  b.setAttribute('aria-pressed',String(selected));
 });
 if(mode==='disassembly'){
  rig.add(boardAssembly);boardAssembly.position.set(...CASE_BOARD_LOCATION);
  boardAssembly.rotation.set(0,0,0);
 }else{
  scene.add(boardAssembly);boardAssembly.position.set(...MAT_BOARD_LOCATION);
  boardAssembly.rotation.set(-Math.PI/2,0,0);
 }
 for(const p of parts){
  if(mode==='disassembly'){
   state.placed[p.id]=p.id;markInstalled(p.id,p.id,{animate:false});
  }else if(meshes.has(p.id))returnToRack(p.id);
 }
 selectPart(mode==='disassembly'?'casefans':'motherboard');
 if(mode!=='disassembly'){
  // Present the board visibly on the anti-static mat, then ask students
  // to confirm its position before installing CPU, DIMMs and SSD.
  const model=ensureMesh('motherboard');
  boardAssembly.add(model);model.position.set(0,0,0);
  model.rotation.set(0,0,0);model.scale.setScalar(1);model.visible=true;
 }
 $('#placementFeedback').textContent=mode==='disassembly'
  ?'Disassembly: select the outermost component and remove it in reverse order.'
  :'Prepare the motherboard on the ESD mat; align each part to its highlighted connector.';
 drawStatus();cameraView([3.8,6.5,8.7],[-.45,-2.02,-.10]);
}
const stage=$('#stage'),tray=$('#removeTray');
stage.addEventListener('dragover',e=>{e.preventDefault();if(state.mode==='disassembly')return;state.hover=nearestZone(e);highlights()});
stage.addEventListener('dragleave',()=>{state.hover=null;highlights()});
stage.addEventListener('drop',e=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain')||active.dragged;if(id)install(id,nearestZone(e));state.hover=null;highlights()});
// Grab the actual 3D mesh from the rack. OrbitControls only runs when no part is being held.
let gesture=null,tapTarget=null;
canvas.addEventListener('pointerdown',e=>{
 if(state.submitted)return;
 const id=meshPick(e);
 // A placed motherboard sits UNDER the CPU, RAM and NVMe targets. Its mesh
 // must not steal taps intended for the next component.
 if(state.mode!=='disassembly'&&state.selected&&state.placed[state.selected]!==state.selected
    &&(!id||state.placed[id]===id)){
   tapTarget={x:e.clientX,y:e.clientY,id:state.selected};return;
 }
 if(!id)return;
 if(state.mode!=='disassembly'&&state.placed[id]===id)return;
 if(state.mode==='disassembly'&&state.removed.has(id))return;
 gesture={id,startX:e.clientX,startY:e.clientY,dragged:false,origin:meshes.get(id).position.clone()};
 controls.enabled=false;canvas.setPointerCapture(e.pointerId);selectPart(id);
});
canvas.addEventListener('pointermove',e=>{
 if(!gesture)return;
 if(Math.hypot(e.clientX-gesture.startX,e.clientY-gesture.startY)>7)gesture.dragged=true;
 if(gesture.dragged){const v=worldAtPointer(e);if(v){const obj=meshes.get(gesture.id);const p=obj.parent===rig?rig.worldToLocal(v.clone()):v;obj.position.copy(p)}}
 if(state.mode==='disassembly'){const r=tray.getBoundingClientRect();
 tray.classList.toggle('hover',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)}
});
canvas.addEventListener('pointerup',e=>{
 if(!gesture){if(tapTarget&&state.mode!=='disassembly'&&Math.hypot(e.clientX-tapTarget.x,e.clientY-tapTarget.y)<8){const z=nearestZone(e);if(z!=='workspace')install(tapTarget.id,z)}tapTarget=null;return}
 tapTarget=null;
 const held=gesture;gesture=null;controls.enabled=true;tray.classList.remove('hover');
 const tr=tray.getBoundingClientRect(),inTray=!tray.hidden&&e.clientX>=tr.left&&e.clientX<=tr.right&&e.clientY>=tr.top&&e.clientY<=tr.bottom;
 if(state.mode==='disassembly'){
  if(inTray)remove(held.id);
  else meshes.get(held.id).position.copy(held.origin);
  return;
 }
 const slot=nearestZone(e);
 if(slot!=='workspace')install(held.id,slot);
 else if(held.dragged&&state.mode==='assembly')install(held.id,'workspace');
 else returnToRack(held.id);
});
canvas.addEventListener('pointercancel',()=>{
 if(gesture){meshes.get(gesture.id).position.copy(gesture.origin);gesture=null}
 tapTarget=null;controls.enabled=true;tray.classList.remove('hover');
});
tray.addEventListener('click',()=>{if(state.mode==='disassembly'&&state.selected)remove(state.selected)});
tray.addEventListener('dragover',e=>{e.preventDefault();tray.classList.add('hover')});
tray.addEventListener('dragleave',()=>tray.classList.remove('hover'));
tray.addEventListener('drop',e=>{e.preventDefault();tray.classList.remove('hover');if(state.mode==='disassembly')remove(e.dataTransfer.getData('text/plain')||state.selected)});
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>reset(b.dataset.mode)));
$('#mountBoardBtn').addEventListener('click',mountPreassembledBoard);
$('#removeSelectedBtn').addEventListener('click',()=>remove(state.selected));
/* Working workspace controls: tray filters, case orientation, camera and guided hints. */
const trayFilters={all:parts.map(p=>p.id),core:['motherboard','cpu'],storage:['ram','storage'],cooling:['cooler','casefans'],power:['psu','gpu']};
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 const filter=button.dataset.filter;
 $$('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 $$('.inventory').forEach(item=>{item.hidden=!(trayFilters[filter]||trayFilters.all).includes(item.dataset.part)});
}));
$$('[data-orientation]').forEach(button=>button.addEventListener('click',()=>{
 orientation=button.dataset.orientation;
 $$('[data-orientation]').forEach(b=>{const current=b===button;b.classList.toggle('selected',current);b.setAttribute('aria-pressed',String(current))});
 if(orientation==='upright')cameraView([7.7,4.5,11.2],[2.28,-.1,0]);
 else if(orientation==='inverted')cameraView([7.6,4.4,10],[2.28,-1.50,0]);
 else cameraView([3.8,6.5,8.7],[-.45,-2.02,-.10]);
}));
function setMouseTool(kind){
 const pan=kind==='pan';
 controls.mouseButtons.LEFT=pan?THREE.MOUSE.PAN:THREE.MOUSE.ROTATE;
 $('#panTool').setAttribute('aria-pressed',String(pan));
 $('#rotateTool').setAttribute('aria-pressed',String(!pan));
 $('#panTool').classList.toggle('selected',pan);$('#rotateTool').classList.toggle('selected',!pan);
}
$('#rotateTool').addEventListener('click',()=>setMouseTool('rotate'));
$('#panTool').addEventListener('click',()=>setMouseTool('pan'));
function zoomBy(scale){camera.position.sub(controls.target).multiplyScalar(scale).add(controls.target);camera.updateProjectionMatrix();controls.update()}
$('#zoomInTool').addEventListener('click',()=>zoomBy(.80));
$('#zoomOutTool').addEventListener('click',()=>zoomBy(1.25));
$('#stepNextBtn').addEventListener('click',()=>{
 if(state.mode!=='disassembly'&&!state.boardMounted&&boardIsPrepared()){
  $('#mountBoardBtn').focus();$('#mountBoardBtn').classList.add('guide-attention');
  setTimeout(()=>$('#mountBoardBtn')?.classList.remove('guide-attention'),1200);return;
 }
 const id=state.mode==='disassembly'?reverse.find(p=>!state.removed.has(p)):sequence.find(p=>state.placed[p]!==p);
 if(id){
  selectPart(id);const p=byId[id];
  if(inPreassembly(id))cameraView([1.4,7.1,6.2],[-3.65,-2.3,-.15]);
  else cameraView([7.4,7.2,8.7],[2.28,-1.5,-.1]);
  $('#stepInstruction').textContent='Now inspect '+p.name+'. '+p.desc+' Select it from the tray and click its highlighted target to continue.';
 }
});
$('#stepBackBtn').addEventListener('click',()=>{
 const previous=state.mode==='disassembly'?reverse[Math.max(0,state.step-1)]:sequence[Math.max(0,state.step-1)];
 if(previous)selectPart(previous);
});
setMouseTool('rotate');
/* Reference-layout tools are real controls, not decorative navigation. */
const helpBtn=$('#labHelpBtn'),helpPanel=$('#labHelpPanel');
helpBtn.addEventListener('click',()=>{
 const next=helpPanel.hidden;helpPanel.hidden=!next;
 helpBtn.setAttribute('aria-expanded',String(next));
});
$('#railGuides').addEventListener('click',()=>$('.guide-main')?.scrollIntoView({behavior:'smooth',block:'start'}));
$('#railCaseView').addEventListener('click',()=>$('#focusCase').click());
$('#railSettings').addEventListener('click',()=>$('#labSettingsPanel').scrollIntoView({behavior:'smooth',block:'center'}));
const searchInput=$('#labSearch');
searchInput.addEventListener('input',()=>{
 const q=searchInput.value.trim().toLowerCase();
 $$('.inventory').forEach(el=>{
  const p=byId[el.dataset.part];
  el.hidden=!!q&&!([p.name,p.short,p.desc,p.category].join(' ').toLowerCase().includes(q));
 });
 if(q)$$('[data-filter]').forEach(btn=>{btn.classList.toggle('active',btn.dataset.filter==='all');btn.setAttribute('aria-pressed',String(btn.dataset.filter==='all'))});
});
let exploded=false;
$('#explodeViewBtn').addEventListener('click',()=>{
 exploded=!exploded;
 const btn=$('#explodeViewBtn');btn.classList.toggle('selected',exploded);btn.setAttribute('aria-pressed',String(exploded));
 const txt=btn.querySelector('span');if(txt)txt.textContent=exploded?'Reassemble':'Explode';
 if(exploded)$('#hoverName').textContent='Exploded view · Installed parts have been separated for inspection; scoring is unchanged.';
 else highlights();
});
$('#resetScene').addEventListener('click',()=>reset(state.mode));$('#submitBtn').addEventListener('click',submit);$('#csvBtn').addEventListener('click',download);$('#againBtn').addEventListener('click',()=>reset(state.mode));
$('#hints').addEventListener('change',e=>{state.hints=e.target.checked;highlights()});
$('#glass').addEventListener('change',e=>panelGlass.visible=e.target.checked);
$('#rgb').addEventListener('change',e=>{glow.visible=e.target.checked});
function cameraView(pos,target){camera.position.set(...pos);controls.target.set(...target);controls.update()}
$('#resetCamera').addEventListener('click',()=>cameraView([3.8,6.5,8.7],[-.45,-2.02,-.10]));
const refButton=$('#caseRefToggle'),reference=$('#caseReference'),refModel=$('#completeCase3D'),refText=$('#referenceStatus');
let referenceLoaded=false,detailedAttempt=false;
function setReferenceVisible(open){
 reference.hidden=!open;refButton.setAttribute('aria-expanded',String(open));
 const text=refButton.querySelector('span');if(text)text.textContent=open?'Return':'Full PC';
 if(open&&!referenceLoaded){referenceLoaded=true;refText.textContent='Loading real system-unit GLB…';refModel.src=upstream+'system_unit.glb'}
 if(open)$('#closeReference').focus();else refButton.focus();
}
refButton.addEventListener('click',()=>setReferenceVisible(reference.hidden));
$('#closeReference').addEventListener('click',()=>setReferenceVisible(false));
$('#loadDetailedCase').addEventListener('click',()=>{
 if(detailedAttempt)return;
 detailedAttempt=true;refText.textContent='Loading high-detail original mesh (about 23 MB)…';
 refModel.src=upstream+'system_unit_update.glb';
});
refModel.addEventListener('load',()=>{refText.textContent=detailedAttempt?'High-detail 3D model ready · 360° inspection':'Real 3D model loaded · 360° inspection'});
refModel.addEventListener('error',()=>{
 if(detailedAttempt){detailedAttempt=false;refModel.src=upstream+'system_unit.glb';refText.textContent='High-detail model unavailable; loading lightweight reference';}
 else refText.textContent='Model unavailable from publisher. Reconnect to view; guided assembly is still accessible.';
});

$('#focusMotherboard').addEventListener('click',()=>state.mode!=='disassembly'&&!state.boardMounted?cameraView([1.4,7.1,6.2],[-3.65,-2.3,-.15]):cameraView([5.7,6.1,7.0],[2.28,-1.50,0]));
$('#focusCase').addEventListener('click',()=>cameraView([7.7,7.2,8.5],[2.28,-1.50,-.1]));
function resize(){const r=canvas.getBoundingClientRect(),w=Math.floor(r.width),h=Math.floor(r.height),pixel=renderer.getPixelRatio();
if(w>0&&h>0&&(canvas.width!==Math.floor(w*pixel)||canvas.height!==Math.floor(h*pixel))){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}}
let firstSuccessfulFrame=false;
let renderedFrames=0;
function frame(){
 requestAnimationFrame(frame);
 try{
  resize();
  rig.rotation.x+=(orientationAngles[orientation]-rig.rotation.x)*.13;
  rig.position.y=-2.69+Math.abs(Math.cos(rig.rotation.x))*2.55+
    Math.abs(Math.sin(rig.rotation.x))*1.2+.13;
  rig.updateWorldMatrix(true,true);
  boardAssembly.updateWorldMatrix(true,true);
  const now=performance.now();
  // Smoothly seat parts into the exact connector, or lift them back out.
  for(const [key,tween] of Array.from(snapTweens.entries())){
    const k=Math.max(0,Math.min(1,(now-tween.start)/tween.duration));
    const t=tween.ease(k);
    if(tween.fromPosition&&tween.toPosition)
      tween.obj.position.lerpVectors(tween.fromPosition,tween.toPosition,t);
    if(tween.fromScale!==undefined)
      tween.obj.scale.setScalar(tween.fromScale+(tween.toScale-tween.fromScale)*t);
    if(tween.fromRotation&&tween.toRotation)
      tween.obj.quaternion.slerpQuaternions(tween.fromRotation,tween.toRotation,t);
    if(k>=1){snapTweens.delete(key);tween.onComplete?.()}
  }
  // Explode is a temporary inspection view. Return to the SAME anchored
  // motherboard/chassis socket rather than the old free-floating scene coords.
  for(const [index,p] of parts.entries()){
    const obj=meshes.get(p.id);
    if(!obj||!obj.visible||gesture?.id===p.id||snapTweens.has(p.id)||snapTweens.has('remove-'+p.id))
      continue;
    const parent=socketParent(p.id);
    if(obj.parent!==parent)continue;
    const pose=socketPose(p.id),target=new THREE.Vector3(...pose.position);
    if(exploded){
      const offset=new THREE.Vector3((index%3-1)*.41,(index-3.5)*.16,.82+(index%2)*.34);
      target.add(offset);
    }
    obj.position.lerp(target,.17);
  }
  for(const p of parts){
    const ring=slots.get(p.id);if(!ring?.visible)continue;
    ring.position.copy(socketWorld(p.id));
    ring.quaternion.copy(socketParent(p.id).getWorldQuaternion(new THREE.Quaternion()));
  }
  controls.update();renderer.render(scene,camera);
  renderedFrames++;
  if(!firstSuccessfulFrame){
    firstSuccessfulFrame=true;$('#stageStatus').hidden=true;
    window.dispatchEvent(new Event('unitlab3d:performance-ready'));
  }
 }catch(e){
  console.error('UnitLab 3D rendering error',e);
  if(!firstSuccessfulFrame){
    firstSuccessfulFrame=true;
    const box=$('#stageStatus');box.hidden=false;
    const label=document.createElement('strong');label.textContent='3D graphics could not start';
    const info=document.createElement('p');info.textContent='Browser rendering error: '+String(e?.message||e);
    const link=document.createElement('a');link.className='btn';link.href='worklab-pro.html?embedded=1';
    link.textContent='Open backup 3D workbench';
    box.replaceChildren(label,info,link);
    window.dispatchEvent(new Event('unitlab3d:performance-error'));
  }
 }
}
renderShelf();
reset('tutorial');
status();
// Read-only observability for classroom QA and automated browser checks.
window.__unitlabQA={
 snapshot:()=>({
   mode:state.mode,step:state.step,placed:{...state.placed},
   boardMounted:state.boardMounted,removed:Array.from(state.removed),
   loaded:active.loaded,pendingAnimations:Array.from(snapTweens.keys()),frames:renderedFrames,
   parentBoard:boardAssembly.parent===rig?'case':'mat'
 }),
 targetClient:id=>{
   if(!byId[id])return null;
   const p=project(byId[id]),rect=canvas.getBoundingClientRect();
   return {x:Math.round(rect.left+p.x),y:Math.round(rect.top+p.y),
     withinStage:p.x>=0&&p.x<rect.width&&p.y>=0&&p.y<rect.height};
 },
 anchors:()=>parts.map(p=>{
   const model=meshes.get(p.id),target=socketWorld(p.id);
   if(model)model.updateWorldMatrix(true,true);
   const pos=model?model.getWorldPosition(new THREE.Vector3()):null;
   const pose=socketPose(p.id);
   return {id:p.id,parent:model?.parent===boardAssembly?'board':model?.parent===rig?'case':model?.parent===scene?'scene':'none',
     assigned:(state.mode==='disassembly'?!state.removed.has(p.id):state.placed[p.id]===p.id),
     local:model?.position.toArray().map(x=>+x.toFixed(3)),targetLocal:pose.position,
     world:pos?.toArray().map(x=>+x.toFixed(3)),
     socketWorld:target.toArray().map(x=>+x.toFixed(3)),
     distance:pos?+pos.distanceTo(target).toFixed(4):null};
 }),
 meshes:()=>Array.from(meshes.entries()).map(([id,obj])=>({id,visible:obj.visible,
   worldSize:new THREE.Box3().setFromObject(obj).getSize(new THREE.Vector3()).toArray().map(v=>+v.toFixed(2))
 }))
};
requestAnimationFrame(frame);
// Real hardware meshes load asynchronously into the visible left-hand 3D rack at startup.

}
