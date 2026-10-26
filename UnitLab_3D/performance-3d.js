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
camera.position.set(7.5,7.3,12.4);
controls.target.set(-.35,-1.6,-.1);
controls.minDistance=4;
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
box(rig,[.12,4.95,2.4],[-1.86,0,0],dark);                    // back edge
box(rig,[.12,4.95,2.4],[1.86,0,0],dark);                     // front edge
box(rig,[3.72,.14,2.40],[0,2.51,0],trim);                    // top
box(rig,[3.72,.14,2.40],[0,-2.51,0],trim);                   // bottom
box(rig,[2.87,3.54,.065],[-.28,.34,-1.02],circuit);        // mounting tray
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
function placeholder(p){
const holder=new THREE.Group();box(holder,p.dims,[0,0,0],new THREE.MeshStandardMaterial({color:0x42606b,wireframe:true,transparent:true,opacity:.27,metalness:.1,roughness:.9}));
return holder;
}
function normalize(model,dim,id){
const clone=model.clone(true);
let best={scale:0,rotation:[0,0,0],center:new THREE.Vector3()};
const orientations=[[0,0,0],[Math.PI/2,0,0],[0,Math.PI/2,0],[0,0,Math.PI/2],[Math.PI/2,Math.PI/2,0],[Math.PI/2,0,Math.PI/2],[0,Math.PI/2,Math.PI/2]];
for(const angles of orientations){
 clone.rotation.set(...angles);clone.position.set(0,0,0);clone.updateMatrixWorld(true);
 const bounds=new THREE.Box3().setFromObject(clone),size=bounds.getSize(new THREE.Vector3());
 if(size.length()<.001)continue;
 const fitted=Math.min(dim[0]/Math.max(size.x,.005),dim[1]/Math.max(size.y,.005),dim[2]/Math.max(size.z,.005));
 if(fitted>best.scale)best={scale:fitted,rotation:angles,center:bounds.getCenter(new THREE.Vector3())};
}
if(best.scale===0)throw Error('Empty model for '+id);
clone.rotation.set(...best.rotation);
// Recenter in rotated world space inside its scaling group.
clone.position.copy(best.center).multiplyScalar(-1);
const grp=new THREE.Group();grp.scale.setScalar(best.scale);grp.add(clone);
grp.traverse(o=>{o.userData.partId=id;if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
return grp;
}
function updateRam(){
const holder=meshes.get('ram');if(!holder)return;
const n=numRam(),p=byId.ram;
holder.clear();for(let i=0;i<n;i++){
const stick=new THREE.Group();stick.position.x=(i-(n-1)/2)*.21;holder.add(stick);
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
const child=normalize(model,p.dims,id);group.clear();group.add(child);active.loaded++;if(id==='ram')updateRam();
}).catch(error=>{
 console.warn('GLB unavailable: '+id,error);
 active.failed++;failure.add(id);
 const msg=$('#meshNotice');
 if(msg){
   msg.hidden=false;msg.textContent=p.name+' could not be downloaded. The assembly desk remains available, but this part has a simplified wireframe placeholder. Check your connection and reload to retry.';
 }
}).finally(()=>{active.loading--;status()});
return group;
}
/* Bench-first assembly. Parts start in the HTML tray—not on an artificial
   3D rack—and retain hardware-relative size in the scene. */
const preassemblyIds=['motherboard','cpu','ram','storage','cooler'];
const benchZones={
 motherboard:[-3.65,-2.51,-.15],
 cpu:[-4.40,-2.36,-.48],
 ram:[-2.72,-2.29,-.28],
 storage:[-3.68,-2.36,.73],
 cooler:[-4.40,-2.17,-.48]
};
function inPreassembly(id){return state.mode!=='disassembly'&&!state.boardMounted&&preassemblyIds.includes(id)}
function boardIsPrepared(){return preassemblyIds.every(id=>state.placed[id]===id)}
function activeZone(p){
 if(inPreassembly(p.id))return benchZones[p.id];
 rig.updateMatrixWorld(true);
 return rig.localToWorld(new THREE.Vector3(...p.pos)).toArray();
}
function markInstalled(id,where){
 const p=byId[id],obj=ensureMesh(id);
 if(inPreassembly(id)){
   scene.add(obj);obj.position.set(...benchZones[id]);
   obj.rotation.set(id==='ram'?0:-Math.PI/2,0,0);
   obj.scale.setScalar(1);
 }else{
   rig.add(obj);obj.position.set(...p.pos);obj.rotation.set(0,0,0);obj.scale.setScalar(1);
 }
 obj.visible=true;
 if(id==='ram')updateRam();
}
function mountPreassembledBoard(){
 if(state.mode==='disassembly'||state.boardMounted)return;
 if(!boardIsPrepared()){
  $('#stepInstruction').textContent='Before mounting the board, install the motherboard, CPU, RAM, NVMe SSD and cooler on the anti-static mat.';
  return;
 }
 state.boardMounted=true;
 for(const id of preassemblyIds){
  const mesh=ensureMesh(id);rig.add(mesh);mesh.position.set(...byId[id].pos);
  mesh.rotation.set(0,0,0);mesh.scale.setScalar(1);mesh.visible=true;
 }
 cameraView([7.7,7.6,9.2],[1.6,-1.45,0]);
 selectPart(sequence[state.step]||'psu');drawStatus();highlights();
}
function returnToRack(id){
 // The tray contains selectable GLB thumbnails; no scale-distorting 3D rack.
 const obj=ensureMesh(id);
 scene.add(obj);obj.position.set(0,-20,0);
 obj.rotation.set(0,0,0);obj.scale.setScalar(1);obj.visible=false;
}
function rackDrop(){return false}
function worldAtPointer(event){
 const rect=canvas.getBoundingClientRect();
 const x=(event.clientX-rect.left)/rect.width*2-1;
 const y=-(event.clientY-rect.top)/rect.height*2+1;
 ray.setFromCamera(new THREE.Vector2(x,y),camera);
 const level=state.mode==='tutorial'&&!state.boardMounted?-2.30:-1.65;
 const plane=new THREE.Plane(new THREE.Vector3(0,1,0),-level);
 return ray.ray.intersectPlane(plane,new THREE.Vector3());
}
/* Hardware tray: lightweight accessible card previews. Importing eight more
   model-viewer instances previously doubled the large GLB downloads on startup.
   The REAL GLB is loaded in the assembly scene on part selection. */
function renderShelf(){
 const shelves=$('#shelves');shelves.replaceChildren();
 for(const p of parts){
  const button=document.createElement('button');
  button.type='button';button.className='inventory';button.dataset.part=p.id;
  button.setAttribute('aria-label','Select '+p.name+' for 3D installation');
  button.draggable=true;
  const icon=document.createElement('span');icon.className='inventory-icon';
  icon.setAttribute('aria-hidden','true');
  const glyph=document.createElement('span');glyph.className='hardware-glyph';
  glyph.textContent=p.short;icon.appendChild(glyph);
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
$('#previewPlaceholder').hidden=false;preview.style.display='none';preview.src=p.url;preview.alt='Realistic 3D '+p.name;
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
const rect=canvas.getBoundingClientRect();const x=e.clientX-rect.left,y=e.clientY-rect.top;
let found='workspace',distance=Infinity;
for(const p of parts){const v=project(p),d=Math.hypot(x-v.x,y-v.y);if(d<distance){found=p.id;distance=d}}
return distance<Math.min(104,rect.height*.16)?found:'workspace';
}
function meshPick(e){
const rect=canvas.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
ray.setFromCamera(mouse,camera);
const hits=ray.intersectObjects([...meshes.values()].filter(m=>m.visible),true);
for(const hit of hits){let o=hit.object;while(o&&!o.userData.partId)o=o.parent;if(o?.userData.partId)return o.userData.partId}
return null;
}
function highlights(){
 const next=sequence[state.step],focus=state.selected||(state.mode==='tutorial'?next:null);
 for(const p of parts){
   const target=slots.get(p.id);
   const guideTarget=state.mode==='tutorial'?next===p.id:focus===p.id;
   const already=state.mode==='disassembly'?state.removed.has(p.id):state.placed[p.id]===p.id;
   target.visible=guideTarget&&!already&&(!state.submitted);
   target.position.set(...activeZone(p));
   target.rotation.x=inPreassembly(p.id)?-Math.PI/2:rig.rotation.x;
   target.material.opacity=state.mode==='tutorial'&&state.hints?.78:.53;
   target.material.color.set(guideTarget?0x87fae0:0x8ecbd8);
   target.scale.setScalar(guideTarget?1.08:1);
 }
 $('#hoverName').textContent=focus&&byId[focus]?'Selected: '+byId[focus].name+' · Click the highlighted target to install':'Rotate the desk · Scroll to zoom · Select parts from the tray';
}
function install(id,slot){
 if(!byId[id]||state.submitted||state.mode==='disassembly')return;
 if(state.placed[id]===id)return;
 if(id!=='motherboard'&&preassemblyIds.includes(id)&&state.placed.motherboard!=='motherboard'){
  if(state.mode==='assembly')state.attempts.push({id,slot,kind:'out-of-sequence',time:Date.now()});
  $('#stepInstruction').textContent='Place the motherboard on the ESD mat before installing its components.';return;
 }
 if(id==='cooler'&&state.placed.cpu!=='cpu'){
  if(state.mode==='assembly')state.attempts.push({id,slot,kind:'out-of-sequence',time:Date.now()});
  $('#stepInstruction').textContent='Install the CPU before attaching its cooler.';return;
 }
 if(!state.boardMounted&&!preassemblyIds.includes(id)){
   if(state.mode==='assembly')state.attempts.push({id,slot,kind:'out-of-sequence',time:Date.now()});
   $('#stepInstruction').textContent='Prepare the motherboard with CPU, RAM, NVMe SSD and cooler first. Then use Move motherboard into case.';
   return;
 }
 if(state.mode==='tutorial'){
   const expected=sequence[state.step];
   if(id!==expected||slot!==id){
     $('#stepInstruction').textContent='Next part: '+(byId[expected]?.name||'complete')+'. Select it from the Parts Tray, then click the indicated mounting ring.';
     return;
   }
   state.placed[id]=slot;state.step++;
 }else{
   const expected=sequence.find(p=>state.placed[p]!==p);
   const kind=slot!==id?'wrong-slot':expected!==id?'out-of-sequence':'correct';
   state.attempts.push({id,slot,kind,time:Date.now()});
   state.placed[id]=slot;
   state.step=sequence.filter(p=>state.placed[p]===p).length;
 }
 markInstalled(id,slot);selectPart(state.mode==='tutorial'?(sequence[state.step]||id):id);drawStatus();highlights();
 if(state.mode==='tutorial'&&state.step===1)cameraView([2.1,8.3,8.3],[-3.55,-2.2,-.15]);
 if(state.mode==='tutorial'&&state.step===5)cameraView([7.4,8.2,11.2],[-.5,-1.65,0]);
}
function remove(id){
 if(state.mode!=='disassembly'||state.submitted||!byId[id]||state.removed.has(id))return;
 const expected=reverse.find(p=>!state.removed.has(p));
 state.attempts.push({id,slot:'tray',kind:id===expected?'correct':'out-of-sequence',time:Date.now()});
 state.removed.add(id);returnToRack(id);
 state.step=state.removed.size;selectPart(id);drawStatus();highlights();
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
 state.mode=mode;state.step=0;state.selected=null;state.placed={};state.boardMounted=mode==='disassembly';state.removed.clear();
 state.attempts=[];state.submitted=false;state.report=null;state.hover=null;
 $('#result').replaceChildren();
 $$('[data-mode]').forEach(b=>{const selected=b.dataset.mode===mode;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});
 for(const p of parts){
   if(mode==='disassembly'){
     state.placed[p.id]=p.id;markInstalled(p.id,p.id);
   }else if(meshes.has(p.id))returnToRack(p.id);
 }
 selectPart(mode==='disassembly'?'casefans':'motherboard');
 drawStatus();
 cameraView([7.5,7.3,12.4],[-.35,-1.6,-.1]);
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
 else cameraView([7.5,7.3,12.4],[-.35,-1.60,-.1]);
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
$('#resetScene').addEventListener('click',()=>reset(state.mode));$('#submitBtn').addEventListener('click',submit);$('#csvBtn').addEventListener('click',download);$('#againBtn').addEventListener('click',()=>reset(state.mode));
$('#hints').addEventListener('change',e=>{state.hints=e.target.checked;highlights()});
$('#glass').addEventListener('change',e=>panelGlass.visible=e.target.checked);
$('#rgb').addEventListener('change',e=>{glow.visible=e.target.checked});
function cameraView(pos,target){camera.position.set(...pos);controls.target.set(...target);controls.update()}
$('#resetCamera').addEventListener('click',()=>cameraView([7.5,7.3,12.4],[-.35,-1.6,-.1]));
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
function frame(){
 requestAnimationFrame(frame);
 try{
  resize();
  rig.rotation.x+=(orientationAngles[orientation]-rig.rotation.x)*.13;
  rig.position.y=-2.69+Math.abs(Math.cos(rig.rotation.x))*2.55+Math.abs(Math.sin(rig.rotation.x))*1.2+.13;
  rig.updateMatrixWorld(true);
  for(const p of parts){
   const ring=slots.get(p.id);
   if(ring?.visible){
    ring.position.set(...activeZone(p));
    ring.rotation.x=inPreassembly(p.id)?-Math.PI/2:rig.rotation.x;
   }
  }
  controls.update();renderer.render(scene,camera);
  if(!firstSuccessfulFrame){
    firstSuccessfulFrame=true;
    $('#stageStatus').hidden=true;
    window.dispatchEvent(new Event('unitlab3d:performance-ready'));
  }
 }catch(e){
  console.error('UnitLab 3D rendering error',e);
  if(!firstSuccessfulFrame){
    firstSuccessfulFrame=true;
    const box=$('#stageStatus');box.hidden=false;
    const label=document.createElement('strong');
    label.textContent='3D graphics could not start';
    const info=document.createElement('p');
    info.textContent='Browser rendering error: '+String(e?.message||e);
    const link=document.createElement('a');link.className='btn';link.href='worklab-pro.html?embedded=1';link.textContent='Open backup 3D workbench';
    box.replaceChildren(label,info,link);
    window.dispatchEvent(new Event('unitlab3d:performance-error'));
  }
 }
}
renderShelf();
reset('tutorial');
status();
requestAnimationFrame(frame);
// Real hardware meshes load asynchronously into the visible left-hand 3D rack at startup.

}
