import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
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
const sequence=parts.map(p=>p.id),reverse=[...sequence].reverse();
const user=sessionStorage.getItem('unitlab3d_local_auth')||sessionStorage.getItem('unitlab_student')||'GUEST';
$('#student').textContent=user==='GUEST'?'Guest · local practice':'Learner code: '+user+' (local demo)';
let renderer,scene,camera,controls,loader;
try{
 renderer=new THREE.WebGLRenderer({canvas:$('#assemblyCanvas'),antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.55;
 renderer.shadowMap.enabled=true;scene=new THREE.Scene();scene.background=new THREE.Color(0x091722);scene.fog=new THREE.FogExp2(0x091722,.025);
 camera=new THREE.PerspectiveCamera(40,1,.1,100);camera.position.set(6.6,3.6,8.5);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=4.8;controls.maxDistance=16;controls.maxPolarAngle=Math.PI*.85;controls.target.set(0,0,0);
 loader=new GLTFLoader();
}catch(e){$('#stageStatus').innerHTML='<strong>3D unavailable</strong><p>WebGL failed. Use the lightweight workbench instead.</p><a class="btn" href="training.html">Open fallback</a>';throw e}
scene.add(new THREE.HemisphereLight(0xe2f5ff,0x263647,2.7));
const sun=new THREE.DirectionalLight(0xffffff,2.9);sun.position.set(5,8,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-9;sun.shadow.camera.right=9;sun.shadow.camera.top=9;sun.shadow.camera.bottom=-9;scene.add(sun);
const glow=new THREE.PointLight(0x43ccdf,37,10);glow.position.set(-3,2,3);scene.add(glow);
const pink=new THREE.PointLight(0xaf70d3,28,10);pink.position.set(3,1,-2);scene.add(pink);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(120,120),new THREE.MeshStandardMaterial({color:0x0a1b27,roughness:.81}));
ground.rotation.x=-Math.PI/2;ground.position.y=-2.57;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(32,44,0x325469,0x163144);grid.position.y=-2.555;scene.add(grid);
const steel=new THREE.MeshStandardMaterial({color:0x223948,metalness:.72,roughness:.36}),dark=new THREE.MeshStandardMaterial({color:0x112431,metalness:.68,roughness:.46}),circuit=new THREE.MeshStandardMaterial({color:0x1e4e56,metalness:.37,roughness:.58});
const rig=new THREE.Group();scene.add(rig);
function box(parent,dim,xyz,material){const obj=new THREE.Mesh(new THREE.BoxGeometry(...dim),material);obj.position.set(...xyz);obj.castShadow=true;obj.receiveShadow=true;parent.add(obj);return obj}
box(rig,[3.65,4.92,.12],[0,0,-1.16],steel);
box(rig,[.13,4.92,2.55],[-1.82,0,-.07],dark);
box(rig,[.13,4.92,2.55],[1.82,0,-.07],steel);
box(rig,[3.74,.13,2.50],[0,2.48,-.03],steel);
box(rig,[3.74,.19,2.50],[0,-2.48,-.03],dark);
box(rig,[3.60,.69,2.31],[0,-2.10,-.04],steel);
box(rig,[2.64,3.12,.05],[-.37,.30,-.80],circuit).castShadow=false;
for(let i=0;i<4;i++)box(rig,[.28,.08,.06],[-1.26+i*.81,2.50,.92],steel);
const panelGlass=box(rig,[3.55,4.68,.02],[0,0,1.25],new THREE.MeshPhysicalMaterial({color:0xc1edff,opacity:.11,transparent:true,roughness:.04,depthWrite:false,side:THREE.DoubleSide}));
panelGlass.visible=false;panelGlass.castShadow=false;
const fans=[];
function makeFan(pos,r,i){const group=new THREE.Group();group.position.set(...pos);rig.add(group);
const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.045,10,36),new THREE.MeshBasicMaterial({color:0x6ff0da}));group.add(ring);
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
const state={mode:'tutorial',step:0,selected:null,placed:{},removed:new Set(),attempts:[],submitted:false,hints:true,hover:null,visited:new Set(),report:null};
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
const holder=new THREE.Group();box(holder,p.dims,[0,0,0],new THREE.MeshStandardMaterial({color:0x3e7f92,metalness:.66,roughness:.4}));
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
function markInstalled(id,where){
const obj=ensureMesh(id),target=byId[where]?.pos||[3.02,-1.32,1.42];obj.position.set(...target);obj.visible=true;
if(id==='ram')updateRam();
}
function renderShelf(){
const shelves=$('#shelves');shelves.replaceChildren();const groups=new Map();
for(const p of parts){if(!groups.has(p.category))groups.set(p.category,[]);groups.get(p.category).push(p)}
for(const [cat,members] of groups){const container=document.createElement('div');container.className='shelf';const head=document.createElement('div');head.className='shelf-name';head.textContent=cat;container.appendChild(head);
for(const p of members){
const button=document.createElement('button');button.className='inventory';button.dataset.part=p.id;button.type='button';button.draggable=true;
const icon=document.createElement('span');icon.className='inventory-icon';icon.textContent=p.short;
const wrapper=document.createElement('span'),title=document.createElement('b'),subtitle=document.createElement('small');
title.textContent=p.name;subtitle.textContent='Textured 3D part';wrapper.append(title,subtitle);button.append(icon,wrapper);
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
const v=new THREE.Vector3(...p.zone).project(camera),r=canvas.getBoundingClientRect();
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
ghost.material.opacity=isGuide?.48:state.mode==='tutorial'?.08:.012;ghost.material.color.set(isGuide?0x72f4c8:0x799cac);
ghost.scale.setScalar(isGuide?1.18:1);
}
$('#hoverName').textContent=state.hover&&byId[state.hover]?'Mount: '+byId[state.hover].name:'PC workstation';
}
function install(id,slot){
if(!byId[id]||state.submitted||state.mode==='disassembly')return;
if(state.mode==='tutorial'){
const expected=sequence[state.step];
if(id!==expected||slot!==id){$('#stepInstruction').textContent='Follow the glowing part and its matching slot. The next item is '+byId[expected]?.name+'.';return}
state.placed[id]=slot;state.step++;
}else{
const expected=sequence.find(p=>state.placed[p]!==p);
const kind=slot!==id?'wrong-slot':expected!==id?'out-of-sequence':'correct';
state.attempts.push({id,slot,kind,time:Date.now()});
state.placed[id]=slot;state.step=sequence.filter(p=>state.placed[p]===p).length;
}
markInstalled(id,slot);selectPart(id);drawStatus();highlights();
}
function remove(id){
if(state.mode!=='disassembly'||state.submitted||!byId[id]||state.removed.has(id))return;
const expected=reverse.find(p=>!state.removed.has(p));
state.attempts.push({id,slot:'tray',kind:id===expected?'correct':'out-of-sequence',time:Date.now()});
state.removed.add(id);meshes.get(id).visible=false;
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
$('#stepInstruction').textContent=next?'Drag '+next.name+' from the cabinet to the glowing 3D mounting target.':'You completed the guided build. Choose an independent test to assess your performance.';
}else{
$('#stepHeading').textContent=state.mode==='assembly'?'Build without a trail':'Disassemble without a trail';
$('#stepInstruction').textContent=state.submitted?'See your assessment checklist below.':'Carry out the build on your own. Wrong slots and ordering errors are counted but NOT corrected or disclosed during the test.';
}
$('#removeTray').hidden=state.mode!=='disassembly';
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
state.mode=mode;state.step=0;state.selected=null;state.placed={};state.removed.clear();state.attempts=[];state.submitted=false;state.report=null;$('#result').replaceChildren();
$$('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
for(const p of parts){let mesh=meshes.get(p.id);if(mode==='disassembly'){mesh=ensureMesh(p.id);mesh.position.set(...p.pos);mesh.visible=true;state.placed[p.id]=p.id;if(p.id==='ram')updateRam()}else if(mesh)mesh.visible=false}
selectPart(mode==='disassembly'?'gpu':'motherboard');drawStatus();highlights();
}
const stage=$('#stage'),tray=$('#removeTray');
stage.addEventListener('dragover',e=>{e.preventDefault();if(state.mode==='disassembly')return;state.hover=nearestZone(e);highlights()});
stage.addEventListener('dragleave',()=>{state.hover=null;highlights()});
stage.addEventListener('drop',e=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain')||active.dragged;if(id)install(id,nearestZone(e));state.hover=null;highlights()});
let gesture=null;
canvas.addEventListener('pointerdown',e=>{
if(state.mode!=='disassembly'||state.submitted)return;
const id=meshPick(e);if(!id)return;gesture={id,x:e.clientX,y:e.clientY};controls.enabled=false;canvas.setPointerCapture(e.pointerId);selectPart(id)
});
canvas.addEventListener('pointerup',e=>{
if(state.mode==='disassembly'){if(gesture){const r=tray.getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)remove(gesture.id)}
gesture=null;controls.enabled=true;tray.classList.remove('hover');return}
if(state.selected&&!state.submitted&&e.pointerType!=='mouse')install(state.selected,nearestZone(e));
});
canvas.addEventListener('pointermove',e=>{if(gesture){const r=tray.getBoundingClientRect();tray.classList.toggle('hover',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)}});
canvas.addEventListener('pointercancel',()=>{gesture=null;controls.enabled=true;tray.classList.remove('hover')});
tray.addEventListener('click',()=>{if(state.mode==='disassembly'&&state.selected)remove(state.selected)});
tray.addEventListener('dragover',e=>{e.preventDefault();tray.classList.add('hover')});
tray.addEventListener('dragleave',()=>tray.classList.remove('hover'));
tray.addEventListener('drop',e=>{e.preventDefault();tray.classList.remove('hover');if(state.mode==='disassembly')remove(e.dataTransfer.getData('text/plain')||state.selected)});
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>reset(b.dataset.mode)));
$('#resetScene').addEventListener('click',()=>reset(state.mode));$('#submitBtn').addEventListener('click',submit);$('#csvBtn').addEventListener('click',download);$('#againBtn').addEventListener('click',()=>reset(state.mode));
$('#hints').addEventListener('change',e=>{state.hints=e.target.checked;highlights()});
$('#glass').addEventListener('change',e=>panelGlass.visible=e.target.checked);
$('#rgb').addEventListener('change',e=>fans.forEach(f=>f.ring.visible=e.target.checked));
$('#resetCamera').addEventListener('click',()=>{camera.position.set(6.6,3.6,8.5);controls.target.set(0,0,0);controls.update()});
function resize(){const r=canvas.getBoundingClientRect(),w=Math.floor(r.width),h=Math.floor(r.height),pixel=renderer.getPixelRatio();
if(w>0&&h>0&&(canvas.width!==Math.floor(w*pixel)||canvas.height!==Math.floor(h*pixel))){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}}
const clock=new THREE.Clock();
function frame(){requestAnimationFrame(frame);resize();controls.update();const t=clock.getElapsedTime();for(const f of fans)if($('#rgb').checked){f.rotor.rotation.z+=.08;f.ring.material.color.setHSL((t*.11+f.i*.23)%1,.95,.61)}renderer.render(scene,camera)}
renderShelf();reset('tutorial');requestAnimationFrame(frame);$('#stageStatus').hidden=true;status();
window.dispatchEvent(new Event('unitlab3d:performance-ready'));
setTimeout(()=>{for(const id of ['ram','storage','psu'])fetchModel(byId[id]).catch(()=>{})},1000);
