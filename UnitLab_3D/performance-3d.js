import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const canvas=$('#assemblyCanvas');
const upstream='https://raw.githubusercontent.com/brickshow/pc-anatomy/main/public/models/';
const specs=[
['motherboard','Motherboard','MB','01 · CORE HARDWARE','motherboard.glb',[2.46,2.88,.20],[-.3,.40,-.56],[-1.32,.41,.08],'Connects the processor, RAM, GPU, storage and power connections. Align standoffs and board form factor.','Isolate mains power and use an approved ESD-safe workspace.'],
['cpu','Processor / CPU','CPU','01 · CORE HARDWARE','cpu.glb',[.68,.65,.23],[-.71,1.10,-.20],[-.89,1.28,.42],'A socketed processor performs computation. Match its socket and firmware requirements.','Align the processor with socket markings; never force it.'],
['cooler','CPU Cooler','FAN','01 · CORE HARDWARE','cpu_fan.glb',[1.00,1.0,.66],[-.71,1.02,.16],[-.69,.65,.70],'The cooler removes CPU heat through a heatsink and fan or radiator.','Apply the correct mounting kit and fan/pump connection.'],
['ram','RAM DIMM Kit','RAM','02 · MEMORY & STORAGE','ram.glb',[.11,1.25,.12],[.56,1.03,-.24],[.96,1.08,.45],'Memory kit: configure two or four DIMM sticks in the PC Builder.','Use the correct DDR generation and recommended slots.'],
['storage','M.2 NVMe SSD','SSD','02 · MEMORY & STORAGE','m.2.glb',[.73,.19,.11],[-.82,-.37,-.26],[-1.10,-.45,.50],'Nonvolatile storage for your operating system and files.','Insert the drive at the instructed angle and secure the retainer.'],
['psu','Power Supply','PSU','03 · POWER & GRAPHICS','psu.glb',[1.15,.73,1.03],[.54,-1.76,-.22],[.94,-1.79,.68],'The PSU converts mains electricity into DC power used by the computer.','Never open the PSU housing. Disconnect power before cabling.'],
['gpu','Graphics Card','GPU','03 · POWER & GRAPHICS','gpu.glb',[2.16,.60,.63],[-.10,-.82,.38],[-.06,-1.01,.99],'The GPU provides graphics acceleration and may require dedicated power cables.','Support the card; release PCIe latch before removal.']
];
const parts=specs.map(([id,name,short,category,filename,dims,pos,zone,desc,safety])=>({
 id,name,short,category,filename,dims,pos,zone,desc,safety,
 url:['ram','storage','psu'].includes(id)?'models/'+(id==='storage'?'m2-ssd':id)+'.glb':upstream+filename
}));
const byId=Object.fromEntries(parts.map(p=>[p.id,p]));
const sequence=['motherboard','cpu','ram','storage','cooler','psu','gpu'],reverse=[...sequence].reverse();
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
const ground=new THREE.Mesh(new THREE.PlaneGeometry(120,120),new THREE.MeshStandardMaterial({color:0x1b2530,roughness:.95}));
ground.rotation.x=-Math.PI/2;ground.position.y=-2.57;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(32,44,0x4c646e,0x293943);grid.position.y=-2.55;grid.material.opacity=.21;grid.material.transparent=true;scene.add(grid);
const steel=new THREE.MeshStandardMaterial({color:0x454c53,metalness:.78,roughness:.35}),dark=new THREE.MeshStandardMaterial({color:0x161c22,metalness:.64,roughness:.49}),circuit=new THREE.MeshStandardMaterial({color:0x2c3c38,metalness:.40,roughness:.7});
const bench=new THREE.Group();scene.add(bench);
const maple=new THREE.MeshStandardMaterial({color:0x78685a,roughness:.86});
const matMaterial=new THREE.MeshStandardMaterial({color:0x174449,roughness:.92,metalness:.03});
const rubber=new THREE.MeshStandardMaterial({color:0x222a30,metalness:.06,roughness:.96});
const rig=new THREE.Group();scene.add(rig);
function box(parent,dim,xyz,material){const obj=new THREE.Mesh(new THREE.BoxGeometry(...dim),material);obj.position.set(...xyz);obj.castShadow=true;obj.receiveShadow=true;parent.add(obj);return obj}
// Service bench and anti-static mat: modeled work surface, not an imported SKU asset.
box(bench,[15.5,.22,7],[-1.25,-2.79,0],maple);
box(bench,[15.5,.10,.20],[-1.25,-2.93,3.4],dark);
for(const x of [-7.8,5.2])for(const z of [-2.65,2.75])box(bench,[.20,1.10,.22],[x,-3.4,z],steel);
box(bench,[3.6,.028,2.70],[-4.25,-2.65,.13],matMaterial);
box(bench,[3.68,.024,.05],[-4.25,-2.62,1.47],rubber);
box(bench,[3.68,.024,.05],[-4.25,-2.62,-1.21],rubber);
box(bench,[.05,.024,2.70],[-6.08,-2.62,.13],rubber);
box(bench,[.05,.024,2.70],[-2.42,-2.62,.13],rubber);
const workLamp=new THREE.PointLight(0xfff2df,11,7);workLamp.position.set(-4,3.25,2.9);scene.add(workLamp);
box(rig,[3.65,4.92,.12],[0,0,-1.16],steel);
box(rig,[.13,4.92,2.55],[-1.82,0,-.07],dark);
box(rig,[.13,4.92,2.55],[1.82,0,-.07],steel);
box(rig,[3.74,.13,2.50],[0,2.48,-.03],steel);
box(rig,[3.74,.19,2.50],[0,-2.48,-.03],dark);
box(rig,[3.60,.69,2.31],[0,-2.10,-.04],steel);
box(rig,[2.64,3.12,.05],[-.37,.30,-.80],circuit).castShadow=false;
for(let i=0;i<4;i++)box(rig,[.28,.08,.06],[-1.26+i*.81,2.50,.92],steel);
/* Chassis service details: mounting standoffs, vent slots and metal trim.
   These represent case hardware; interactive parts are still the licensed GLB meshes. */
const screwMaterial=new THREE.MeshStandardMaterial({color:0xc5cacb,metalness:.93,roughness:.26});
for(const x of [-1.45,-.35,.73])for(const y of [-1.25,.16,1.57]){
 const standoff=new THREE.Mesh(new THREE.CylinderGeometry(.064,.064,.05,16),screwMaterial);
 standoff.rotation.x=Math.PI/2;standoff.position.set(x,y,-.69);
 standoff.castShadow=true;rig.add(standoff);
}
for(let i=0;i<18;i++){const slit=box(rig,[.018,.42,.017],[1.70,1.95-i*.235,-1.1],dark);slit.castShadow=false}
for(let i=0;i<9;i++){box(rig,[1.22,.023,.023],[.59,-2.28+i*.055,1.14],dark)}

const panelGlass=box(rig,[3.55,4.68,.02],[0,0,1.25],new THREE.MeshPhysicalMaterial({color:0xc1edff,opacity:.11,transparent:true,roughness:.04,depthWrite:false,side:THREE.DoubleSide}));
panelGlass.visible=false;panelGlass.castShadow=false;
const fans=[];
function makeFan(pos,r,i){const group=new THREE.Group();group.position.set(...pos);rig.add(group);
const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.028,12,56),new THREE.MeshStandardMaterial({color:0x8dd7c7,emissive:0x163f35,emissiveIntensity:.6,metalness:.22,roughness:.32}));group.add(ring);
const rotor=new THREE.Group();group.add(rotor);
for(let n=0;n<7;n++){const blade=box(rotor,[.14,r*.9,.05],[0,r*.27,0],steel);blade.rotation.z=n*2*Math.PI/7}
fans.push({rotor,ring,i})}
for(let i=0;i<3;i++)makeFan([1.36,1.35-i*1.35,.92],.39,i);
makeFan([-1.44,1.48,.69],.34,3);
const slots=new Map();
for(const p of parts){
const [w,h]=p.id==='motherboard'?[1.02,1.78]:p.id==='gpu'?[1.20,.42]:p.id==='ram'?[.35,.91]:p.id==='psu'?[.90,.45]:p.id==='storage'?[.56,.23]:p.id==='cooler'?[.81,.83]:[.45,.46];
const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:0x76aabb,opacity:.035,transparent:true,depthWrite:false,side:THREE.DoubleSide}));
m.position.set(...p.zone);scene.add(m);slots.set(p.id,m);
}
const assetCache=new Map(),meshes=new Map(),failure=new Set();
const state={mode:'tutorial',step:0,selected:null,placed:{},boardMounted:false,removed:new Set(),attempts:[],submitted:false,hints:true,hover:null,visited:new Set(),report:null};
const active={loading:0,loaded:0,failed:0,canvasPart:null,down:null,dragged:null};
function snapshot(){try{return JSON.parse(localStorage.getItem('unitlab3d_livebuild_v4')||'null')}catch{return null}}
function numRam(){return Math.max(2,Math.min(4,snapshot()?.parts?.ram?.dimms||2))}
function status(){$('#assetsStatus').textContent=active.loading?'Loading real meshes · '+active.loading:active.loaded+' real meshes'+(active.failed?' · '+active.failed+' backups':'')}
function fetchModel(p){
if(assetCache.has(p.id))return assetCache.get(p.id);
const promise=new Promise((resolve,reject)=>loader.load(p.url,glb=>resolve(glb.scene),undefined,reject));
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
const m=normalize(original,[.10,1.27,.11],'ram');stick.clear();stick.add(m);
}).catch(()=>{});
}
}
function ensureMesh(id){
if(meshes.has(id))return meshes.get(id);
const p=byId[id],group=new THREE.Group();group.userData.partId=id;group.position.set(...p.pos);group.add(placeholder(p));scene.add(group);meshes.set(id,group);
active.loading++;status();
fetchModel(p).then(model=>{
const child=normalize(model,p.dims,id);group.clear();group.add(child);active.loaded++;if(id==='ram')updateRam();
}).catch(error=>{console.warn('GLB unavailable: '+id,error);active.failed++;failure.add(id)}).finally(()=>{active.loading--;status()});
return group;
}
/* Guided assembly now starts on the antistatic mat and moves the populated
   motherboard into the case after the first five hardware operations.
   Mount points are educational approximations, not dimensionally exact CAD. */
const preassemblyIds=new Set(['motherboard','cpu','ram','storage','cooler']);
const benchZones={
 motherboard:[-4.25,-2.46,.12],cpu:[-4.54,-2.30,-.38],
 ram:[-3.62,-2.22,-.08],storage:[-4.95,-2.27,.55],cooler:[-4.54,-2.09,-.38]
};
function inPreassembly(id){return state.mode==='tutorial'&&!state.boardMounted&&preassemblyIds.has(id)}
function activeZone(p){return inPreassembly(p.id)?benchZones[p.id]:p.zone}
function markInstalled(id,where){
 const obj=ensureMesh(id),target=byId[where]?.pos||[3.02,-1.32,1.42];
 if(inPreassembly(id)){
   obj.position.set(...benchZones[id]);obj.scale.setScalar(id==='motherboard' ? 0.78 : id==='cooler' ? 0.48 : id==='ram' ? 0.55 : 0.66);
   obj.rotation.set(id==='motherboard'?-Math.PI/2:0,0,0);
 }else{
   obj.position.set(...target);obj.scale.setScalar(1);obj.rotation.set(0,0,0);
 }
 obj.visible=true;if(id==='ram')updateRam();
}
function mountPreassembledBoard(){
 if(state.mode!=='tutorial'||state.boardMounted||state.step<5)return;
 state.boardMounted=true;
 for(const id of preassemblyIds){
  if(state.placed[id]!==id)continue;
  const mesh=ensureMesh(id);
  mesh.position.set(...byId[id].pos);mesh.rotation.set(0,0,0);mesh.scale.setScalar(1);
  if(id==='ram')updateRam();
 }
 cameraView([6.6,3.6,9.6],[0,0,0]);
 drawStatus();highlights();
}


/* The 3D parts are real separate mesh objects on the LEFT rack inside the same Three.js scene.
   Each is the exact object students drag from shelf to the open chassis. */
const rackPositions=Object.fromEntries(parts.map((p,i)=>[p.id,new THREE.Vector3(-3.60,2.04-i*.68,.48)]));
const rack=new THREE.Group();scene.add(rack);
for(const p of parts){
 const here=rackPositions[p.id];
 box(rack,[1.18,.055,.72],[here.x,here.y-.34,.18],steel);
 box(rack,[1.10,.56,.045],[here.x,here.y,.00],dark);
 const led=new THREE.Mesh(new THREE.PlaneGeometry(1.10,.04),new THREE.MeshBasicMaterial({color:0x55dfce,transparent:true,opacity:.37}));
 led.position.set(here.x,here.y-.31,.46);rack.add(led);
}
function modelRackScale(id){const p=byId[id];return .72/Math.max(...p.dims)}
function returnToRack(id){
 const obj=ensureMesh(id);
 obj.position.copy(rackPositions[id]);obj.scale.setScalar(modelRackScale(id));obj.visible=true;
}
function rackDrop(clientX,clientY){
 const rect=canvas.getBoundingClientRect();
 const x=clientX-rect.left,y=clientY-rect.top;
 for(const p of parts){
  const center=rackPositions[p.id].clone().project(camera);
  const xx=(center.x+1)*.5*rect.width,yy=(1-center.y)*.5*rect.height;
  if(Math.hypot(x-xx,y-yy)<Math.max(48,Math.min(105,rect.height*.14)))return true;
 }
 return false;
}
function worldAtPointer(event){
 const rect=canvas.getBoundingClientRect();
 const mouseX=(event.clientX-rect.left)/rect.width*2-1;
 const mouseY=-(event.clientY-rect.top)/rect.height*2+1;
 ray.setFromCamera(new THREE.Vector2(mouseX,mouseY),camera);
 const plane=new THREE.Plane(new THREE.Vector3(0,0,1),-1.15);
 return ray.ray.intersectPlane(plane,new THREE.Vector3());
}

function renderShelf(){
const shelves=$('#shelves');shelves.replaceChildren();const groups=new Map();
for(const p of parts){if(!groups.has(p.category))groups.set(p.category,[]);groups.get(p.category).push(p)}
for(const [cat,members] of groups){const container=document.createElement('div');container.className='shelf';const head=document.createElement('div');head.className='shelf-name';head.textContent=cat;container.appendChild(head);
for(const p of members){
const button=document.createElement('button');button.className='inventory';button.dataset.part=p.id;button.type='button';button.draggable=true;
const icon=document.createElement('span');icon.className='inventory-icon';
const model=document.createElement('model-viewer');
model.setAttribute('src',p.url);model.setAttribute('alt','Actual 3D model of '+p.name);
model.setAttribute('camera-orbit','30deg 75deg auto');model.setAttribute('environment-image','neutral');
model.setAttribute('auto-rotate','');model.setAttribute('rotation-per-second','18deg');
model.setAttribute('interaction-prompt','none');model.setAttribute('loading','lazy');
model.setAttribute('shadow-intensity','.65');model.setAttribute('exposure','1.3');
model.setAttribute('aria-hidden','true');
const loading=document.createElement('span');loading.className='model-loading';loading.textContent='3D '+p.short;
icon.append(loading,model);
model.addEventListener('load',()=>loading.hidden=true);
model.addEventListener('error',()=>{loading.hidden=false;loading.textContent=p.short+' (preview unavailable)'});
const wrapper=document.createElement('span');wrapper.className='inventory-text';
const title=document.createElement('b'),subtitle=document.createElement('small');
title.textContent=p.name;subtitle.textContent='Drag this 3D model → PC case';
wrapper.append(title,subtitle);button.append(icon,wrapper);
button.addEventListener('click',()=>selectPart(p.id));button.addEventListener('dragstart',e=>{
state.selected=p.id;inspect(p.id);active.dragged=p.id;
e.dataTransfer.setData('text/plain',p.id);e.dataTransfer.effectAllowed='move';renderShelfStyles();
});
container.appendChild(button);
} shelves.appendChild(container)}
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
function selectPart(id){state.selected=id;inspect(id);renderShelfStyles();highlights()}
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
for(const p of parts){
const ghost=slots.get(p.id),isGuide=state.mode==='tutorial'&&state.hints&&sequence[state.step]===p.id;
ghost.position.set(...activeZone(p));ghost.rotation.x=inPreassembly(p.id)?-Math.PI/2:0;
ghost.material.opacity=isGuide?.48:state.mode==='tutorial'?.08:.012;ghost.material.color.set(isGuide?0x72f4c8:0x799cac);
ghost.scale.setScalar(isGuide?1.18:1);
}
$('#hoverName').textContent=state.mode==='tutorial'&&state.hover&&byId[state.hover]?'Mount: '+byId[state.hover].name:'3D assembly workstation';
}
function install(id,slot){
if(!byId[id]||state.submitted||state.mode==='disassembly')return;
if(state.mode==='tutorial'){
if(state.step>=5&&!state.boardMounted){$('#stepInstruction').textContent='First move your populated motherboard from the antistatic mat into the case using the Mount motherboard button.';returnToRack(id);return}
const expected=sequence[state.step];
if(id!==expected||slot!==id){$('#stepInstruction').textContent='Follow the glowing part and its matching slot. The next item is '+byId[expected]?.name+'.';returnToRack(id);return}
state.placed[id]=slot;state.step++;
}else{
const expected=sequence.find(p=>state.placed[p]!==p);
const kind=slot!==id?'wrong-slot':expected!==id?'out-of-sequence':'correct';
state.attempts.push({id,slot,kind,time:Date.now()});
state.placed[id]=slot;state.step=sequence.filter(p=>state.placed[p]===p).length;
}
markInstalled(id,slot);selectPart(id);drawStatus();highlights();
if(state.mode==='tutorial'&&state.step===1)cameraView([-1.2,1.4,5.4],[-.5,.35,-.40]);
if(state.mode==='tutorial'&&state.step===5)cameraView([7.0,3.8,11.7],[-.95,0,0]);
}
function remove(id){
if(state.mode!=='disassembly'||state.submitted||!byId[id]||state.removed.has(id))return;
const expected=reverse.find(p=>!state.removed.has(p));
state.attempts.push({id,slot:'tray',kind:id===expected?'correct':'out-of-sequence',time:Date.now()});
state.removed.add(id);returnToRack(id);
state.step=state.removed.size;selectPart(id);drawStatus();
}
function drawStatus(){
const done=state.mode==='disassembly'?state.removed.size:sequence.filter(id=>state.placed[id]===id).length;
$('#modeLabel').textContent={tutorial:'◉ GUIDED ASSEMBLY',assembly:'◉ ASSEMBLY PERFORMANCE',disassembly:'◉ DISASSEMBLY PERFORMANCE'}[state.mode];
$('#modeKicker').textContent=state.mode==='tutorial'?'GUIDED TRAINING':'INDEPENDENT PERFORMANCE';
$('#progressFill').style.width=(done/7*100)+'%';
$('#progressText').textContent=done+' / 7 '+(state.mode==='disassembly'?'components removed':'components correctly installed');
$('#hints').disabled=state.mode!=='tutorial';$('#hints').checked=state.mode==='tutorial'&&state.hints;
$('#stepNumber').textContent=state.mode==='tutorial'?'STEP '+Math.min(state.step+1,7)+' / 7':'NO PLACEMENT HINTS';
if(state.mode==='tutorial'){
const next=byId[sequence[state.step]];$('#stepHeading').textContent=next?'Follow the placement guide':'Guided build finished';
$('#stepInstruction').textContent=state.step>=5&&!state.boardMounted
 ?'The CPU, RAM, SSD and cooler are prepared on the anti-static mat. Mount the complete motherboard inside the case before installing the PSU and graphics card.'
 :(next?'Drag '+next.name+' from the cabinet to the glowing '+(inPreassembly(next.id)?'anti-static mat':'case')+' target.':'You completed the guided build. Choose an independent test to assess your performance.');
}else{
$('#stepHeading').textContent=state.mode==='assembly'?'Build without a trail':'Disassemble without a trail';
$('#stepInstruction').textContent=state.submitted?'See your assessment checklist below.':'Carry out the build on your own. Wrong slots and ordering errors are counted but NOT corrected or disclosed during the test.';
}
$('#removeTray').hidden=state.mode!=='disassembly';
$('#mountBoardBtn').hidden=!(state.mode==='tutorial'&&state.step>=5&&!state.boardMounted);
$('#submitBtn').hidden=state.mode==='tutorial'||state.submitted;
$('#againBtn').hidden=!state.submitted;$('#csvBtn').hidden=!state.submitted;
renderShelfStyles();
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
state.mode=mode;state.step=0;state.selected=null;state.placed={};state.boardMounted=false;state.removed.clear();state.attempts=[];state.submitted=false;state.report=null;$('#result').replaceChildren();
$$('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
for(const p of parts){
 const mesh=ensureMesh(p.id);
 if(mode==='disassembly'){mesh.position.set(...p.pos);mesh.scale.setScalar(1);mesh.visible=true;state.placed[p.id]=p.id;if(p.id==='ram')updateRam()}
 else returnToRack(p.id);
}
selectPart(mode==='disassembly'?'gpu':'motherboard');drawStatus();highlights();
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
 if(!id){if(state.mode!=='disassembly'&&state.selected)tapTarget={x:e.clientX,y:e.clientY,id:state.selected};return} // Empty area can rotate the camera.
 if(state.mode!=='disassembly'&&state.placed[id]===id)return;
 if(state.mode==='disassembly'&&state.removed.has(id))return;
 gesture={id,startX:e.clientX,startY:e.clientY,dragged:false,origin:meshes.get(id).position.clone()};
 controls.enabled=false;canvas.setPointerCapture(e.pointerId);selectPart(id);
});
canvas.addEventListener('pointermove',e=>{
 if(!gesture)return;
 if(Math.hypot(e.clientX-gesture.startX,e.clientY-gesture.startY)>7)gesture.dragged=true;
 if(gesture.dragged){const v=worldAtPointer(e);if(v)meshes.get(gesture.id).position.copy(v)}
 if(state.mode==='disassembly'){const r=tray.getBoundingClientRect();
 tray.classList.toggle('hover',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)}
});
canvas.addEventListener('pointerup',e=>{
 if(!gesture){if(tapTarget&&state.mode!=='disassembly'&&Math.hypot(e.clientX-tapTarget.x,e.clientY-tapTarget.y)<8){const z=nearestZone(e);if(z!=='workspace')install(tapTarget.id,z)}tapTarget=null;return}
 tapTarget=null;
 const held=gesture;gesture=null;controls.enabled=true;tray.classList.remove('hover');
 const tr=tray.getBoundingClientRect(),inTray=!tray.hidden&&e.clientX>=tr.left&&e.clientX<=tr.right&&e.clientY>=tr.top&&e.clientY<=tr.bottom;
 if(state.mode==='disassembly'){
  if(inTray||rackDrop(e.clientX,e.clientY))remove(held.id);
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
$('#resetScene').addEventListener('click',()=>reset(state.mode));$('#submitBtn').addEventListener('click',submit);$('#csvBtn').addEventListener('click',download);$('#againBtn').addEventListener('click',()=>reset(state.mode));
$('#hints').addEventListener('change',e=>{state.hints=e.target.checked;highlights()});
$('#glass').addEventListener('change',e=>panelGlass.visible=e.target.checked);
$('#rgb').addEventListener('change',e=>fans.forEach(f=>f.ring.visible=e.target.checked));
function cameraView(pos,target){camera.position.set(...pos);controls.target.set(...target);controls.update()}
$('#resetCamera').addEventListener('click',()=>cameraView([7.0,3.8,11.7],[-.95,0,0]));
const refButton=$('#caseRefToggle'),reference=$('#caseReference'),refModel=$('#completeCase3D'),refText=$('#referenceStatus');
let referenceLoaded=false,detailedAttempt=false;
function setReferenceVisible(open){
 reference.hidden=!open;refButton.setAttribute('aria-expanded',String(open));
 refButton.textContent=open?'Return to assembly':'View real assembled PC';
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

$('#focusMotherboard').addEventListener('click',()=>cameraView([-1.2,1.4,5.4],[-.5,.35,-.40]));
$('#focusCase').addEventListener('click',()=>cameraView([6.9,3.8,9.2],[.0,0,0]));
function resize(){const r=canvas.getBoundingClientRect(),w=Math.floor(r.width),h=Math.floor(r.height),pixel=renderer.getPixelRatio();
if(w>0&&h>0&&(canvas.width!==Math.floor(w*pixel)||canvas.height!==Math.floor(h*pixel))){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}}
function frame(){requestAnimationFrame(frame);resize();controls.update();for(const f of fans)if($('#rgb').checked)f.rotor.rotation.z+=.016;renderer.render(scene,camera)}
renderShelf();reset('tutorial');requestAnimationFrame(frame);status();
const assetMonitor=setInterval(()=>{if(active.loading!==0)return;clearInterval(assetMonitor);if(active.failed){$('#stageStatus').innerHTML='<strong>Some detailed 3D meshes failed to load</strong><p>Outlined forms are temporary fallbacks, not realistic hardware. Reconnect and restart to load licensed GLB models.</p>';}else{$('#stageStatus').hidden=true;}},450);
window.dispatchEvent(new Event('unitlab3d:performance-ready'));
// Real hardware meshes load asynchronously into the visible left-hand 3D rack at startup.
