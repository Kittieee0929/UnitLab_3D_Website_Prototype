import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const descriptions = {
 case: ['Case / Chassis','The chassis supports the hardware, airflow path, mounting points, cable routing and side panels. This training model uses an RGB-style tower.','Inspect case edges and stand-offs. Handle the tempered-glass side panel with care.'],
 motherboard: ['Motherboard','The motherboard connects the CPU, memory, storage, GPU, fans and power. Socket, memory generation and form factor control compatibility.','Unplug and use approved ESD handling. Check that the standoffs align with the motherboard holes.'],
 cpu: ['Processor / CPU','The processor executes instructions. Correct socket and motherboard firmware support are essential.','Align the socket marking and never force the CPU into the socket. Avoid touching contacts.'],
 cooler: ['CPU cooling assembly','The cooling assembly transfers heat away from the CPU using heatsink fins, airflow and/or liquid cooling, depending on model.','Use correct mounting brackets and thermal compound according to manufacturer guidance. Connect fan/pump headers.'],
 ram: ['Memory / RAM','Dual inline memory modules hold active application data. DDR4 and DDR5 cannot be interchanged.','Align the notch, seat evenly, and confirm retention latches are fully engaged.'],
 storage: ['M.2 NVMe SSD','An M.2 SSD stores the operating system and files without power. It is secured to a compatible M.2 socket.','Insert gently at the recommended angle. Secure with the correct retention screw or latch.'],
 psu: ['Power supply / PSU','The PSU provides the computer with the DC power needed by the CPU, motherboard, storage, graphics card, and fans.','Never open its housing. Disconnect mains before cabling and check the correct power connector pinouts.'],
 gpu: ['Graphics card / GPU','A discrete graphics card handles rendering workloads, connects to a PCIe expansion slot and may need dedicated power.','Release the PCIe slot latch before removal. Check card length and GPU power connectors.']
};
const order=['case','motherboard','cpu','cooler','ram','storage','psu','gpu'];
const assembly=[
 ['case','Check the unplugged chassis, grounding procedure, standoff layout and clear workspace.'],
 ['motherboard','Confirm socket/form factor compatibility and mount the motherboard on correct standoffs (this model simplifies the sequence).'],
 ['cpu','Align the processor with the socket and install without forcing any pins.'],
 ['cooler','Install thermal solution and connect the correct CPU fan or pump header.'],
 ['ram','Insert DIMMs into recommended slots until the latches click.'],
 ['storage','Seat the M.2 SSD and secure it with its designated retainer.'],
 ['psu','Mount the PSU and route correct board and CPU power cables.'],
 ['gpu','Install the GPU, secure the bracket and connect PCIe power where required.']
];
const disassembly=[
 ['gpu','Isolate all power, disconnect PCIe power cables and release the GPU from its slot.'],
 ['psu','Trace and unplug PSU cables before removing the unit, without opening its housing.'],
 ['storage','Remove M.2 retention hardware and lift the SSD gently.'],
 ['ram','Release the latches and remove memory by holding the edges.'],
 ['cooler','Release the cooler according to its mounting procedure, supporting the board.'],
 ['cpu','Open the socket retention mechanism and lift the processor without force.'],
 ['motherboard','Remove screws and lift out the board after verifying all cables are disconnected.'],
 ['case','Organize removed components and inspect the empty chassis for stray screws.']
];
const state={mode:'explore',step:0,selected:'motherboard',visited:new Set(),rgb:true,power:true,glass:false,explode:0};
const parts={};
const movingFans=[],lightBars=[];
const ramSticks=[],gpuFanModels=[];
let gpuNamePlate=null,cpuNamePlate=null;
let liveSnapshot=null;
const mats={
 metal:new THREE.MeshStandardMaterial({color:0x182633,metalness:.82,roughness:.33}),
 dark:new THREE.MeshStandardMaterial({color:0x0b1722,metalness:.75,roughness:.4}),
 black:new THREE.MeshStandardMaterial({color:0x101823,metalness:.45,roughness:.6}),
 board:new THREE.MeshStandardMaterial({color:0x143947,metalness:.45,roughness:.65}),
 silver:new THREE.MeshStandardMaterial({color:0x94afbe,metalness:.88,roughness:.27}),
 nickel:new THREE.MeshStandardMaterial({color:0x485b70,metalness:.8,roughness:.28}),
 copper:new THREE.MeshStandardMaterial({color:0xb8844e,metalness:.83,roughness:.33}),
 white:new THREE.MeshStandardMaterial({color:0xf0f8ff,metalness:.15,roughness:.55}),
 violet:new THREE.MeshStandardMaterial({color:0x5862a3,metalness:.42,roughness:.5}),
 glass:new THREE.MeshPhysicalMaterial({color:0xc4efff,metalness:.03,roughness:.07,transparent:true,opacity:.13,depthWrite:false,side:THREE.DoubleSide})
};
const renderer=new THREE.WebGLRenderer({canvas:$('#viewport'),antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.7;
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x08111b,.032);
const camera=new THREE.PerspectiveCamera(40,1,.1,80);camera.position.set(6.1,3.35,8.1);
const controls=new OrbitControls(camera,$('#viewport'));controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=5.7;controls.maxDistance=15;controls.target.set(0,.1,0);controls.maxPolarAngle=Math.PI*.79;controls.update();
scene.add(new THREE.HemisphereLight(0xddefff,0x152334,2.4));
const keyLight=new THREE.DirectionalLight(0xe3f3ff,3.2);keyLight.position.set(5,9,8);keyLight.castShadow=true;keyLight.shadow.mapSize.set(1024,1024);keyLight.shadow.camera.left=-7;keyLight.shadow.camera.right=7;keyLight.shadow.camera.top=7;keyLight.shadow.camera.bottom=-7;scene.add(keyLight);
const edgeLight=new THREE.PointLight(0x47e4f0,60,12);edgeLight.position.set(-3,2,3);scene.add(edgeLight);
const pinkLight=new THREE.PointLight(0xc365fc,40,10);pinkLight.position.set(3,2,-2);scene.add(pinkLight);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:0x081321,metalness:.26,roughness:.7}));ground.rotation.x=-Math.PI/2;ground.position.y=-2.61;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(30,40,0x203c51,0x102539);grid.position.y=-2.605;scene.add(grid);
const assemblyRoot=new THREE.Group();scene.add(assemblyRoot);
function box(parent,w,h,d,x,y,z,mat){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function cyl(parent,r,depth,x,y,z,material,axis='z'){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,depth,28),material);m.rotation.x=axis==='z'?Math.PI/2:0;m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
function textTexture(text,opt={}){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.clearRect(0,0,512,128);x.textAlign='center';x.textBaseline='middle';x.fillStyle=opt.color||'#e2f9ff';x.font=(opt.weight||'bold')+' '+(opt.size||38)+'px system-ui';x.fillText(text,256,64,480);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function label(group,text,w,h,x,y,z,opts={}){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:textTexture(text,opts),transparent:true,side:THREE.DoubleSide,depthWrite:false}));m.position.set(x,y,z);group.add(m);return m}
function tintGlow(hue){return new THREE.Color().setHSL(hue,1,.61)}
function glowMaterial(){return new THREE.MeshBasicMaterial({color:0x4ee7f7,toneMapped:false})}
function ring(parent,r,depth,x,y,z){const mat=glowMaterial();const m=new THREE.Mesh(new THREE.TorusGeometry(r,depth,10,40),mat);m.position.set(x,y,z);parent.add(m);lightBars.push(m);return m}
function partGroup(name){const g=new THREE.Group();g.userData.part=name;parts[name]=g;assemblyRoot.add(g);return g}
function tagMeshes(group,part){group.traverse(o=>{if(o.isMesh)o.userData.part=part})}
const chassis=partGroup('case');
box(chassis,3.35,4.9,.15,0,0,-1.25,mats.metal);
box(chassis,.13,4.9,2.6,-1.67,0,0,mats.black);
box(chassis,.13,4.9,2.6,1.67,0,0,mats.metal);
box(chassis,3.48,.15,2.65,0,2.47,0,mats.black);
box(chassis,3.48,.18,2.65,0,-2.47,0,mats.black);
box(chassis,3.26,.7,2.32,0,-1.97,-.04,mats.metal);
for(let i=0;i<2;i++)box(chassis,.35,.2,.22,-1.18+i*2.4,-2.54,-.75,mats.black);
for(let i=0;i<6;i++)box(chassis,.035,.6,.06,-1.55+i*.55,1.90,1.31,mats.nickel);
label(chassis,'UNITLAB   //   AIRFLOW',2.3,.24,0,-2.14,1.16,{size:28});
const topFanPositions=[-1.0,0,1.0];
function makeFan(group,x,y,z,size=0.42){const g=new THREE.Group();g.position.set(x,y,z);group.add(g);cyl(g,size+.085,.14,0,0,0,mats.black);const outline=ring(g,size*.78,.042,0,0,.095);let rotor=new THREE.Group();g.add(rotor);rotor.position.z=.19;for(let i=0;i<7;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(.13,size*.7,.045),mats.silver);b.position.y=size*.27;b.rotation.z=i*Math.PI*2/7;rotor.add(b)}cyl(rotor,size*.15,.09,0,0,0,mats.metal);movingFans.push(rotor);return g}
for(let i=0;i<3;i++)makeFan(chassis,1.18,1.36-i*1.25,.94,.42);
const rearFan=makeFan(chassis,-1.34,1.42,.48,.35);
const motherboard=partGroup('motherboard');
box(motherboard,2.5,3.3,.13,-.32,.22,-.83,mats.board);
for(let i=0;i<7;i++){box(motherboard,.09,.17,.085,-1.35+i*.31,1.63,-.7,mats.nickel)}
for(let i=0;i<50;i++){const x=-1.47+(i%10)*.245,y=-1.2+Math.floor(i/10)*.51;const small=box(motherboard,.13,.025,.027,x,y,-.73,i%4===0?mats.copper:mats.nickel);small.rotation.z=i*.12}
for(let i=0;i<4;i++)box(motherboard,.09,.3,.09,-1.40+i*.33,-.84,-.69,mats.silver);
box(motherboard,.4,.68,.14,-1.30,.78,-.64,mats.silver);
label(motherboard,'UNITLAB M-BOARD',1.58,.21,-.26,-.95,-.715,{size:27});
const cpu=partGroup('cpu');
box(cpu,.82,.82,.14,-.62,.83,-.57,mats.silver);box(cpu,.68,.68,.07,-.62,.83,-.48,mats.nickel);label(cpu,'CPU',.47,.2,-.62,.86,-.433,{size:46});
const cooler=partGroup('cooler');
for(let i=0;i<10;i++)box(cooler,1.08,.065,.75,-.62,.34+i*.115,-.12,mats.silver);
box(cooler,1.11,1.22,.12,-.62,.89,.36,mats.black);
makeFan(cooler,-.62,.88,.50,.38);
const ram=partGroup('ram');
for(let i=0;i<4;i++){
  const stick=new THREE.Group();ram.add(stick);ramSticks.push(stick);
  const x=.15+i*.17;
  box(stick,.115,1.5,.18,x,.70,-.57,mats.black);
  box(stick,.08,1.39,.035,x,.70,-.45,mats.board);
  for(let j=0;j<7;j++)box(stick,.08,.115,.05,x,1.26-j*.2,-.405,mats.nickel);
  const m=box(stick,.12,.095,.22,x,1.48,-.57,glowMaterial());lightBars.push(m);
}
const storage=partGroup('storage');
box(storage,.72,.19,.09,-.16,-.45,-.60,mats.board);box(storage,.55,.12,.08,-.17,-.45,-.535,mats.nickel);
label(storage,'NVMe',.49,.12,-.17,-.45,-.486,{size:38});
const psu=partGroup('psu');
box(psu,1.42,.65,1.60,.50,-2.02,-.12,mats.black);
for(let i=0;i<5;i++)box(psu,1.25,.02,.05,.50,-1.89+i*.10,.71,mats.nickel);
label(psu,'750W  POWER',1.13,.2,.5,-2.11,.716,{size:26});
const gpu=partGroup('gpu');
box(gpu,2.85,.64,.67,-.02,-.74,.42,mats.black);
box(gpu,2.89,.10,.69,-.02,-.42,.42,mats.nickel);
for(let i=0;i<3;i++)gpuFanModels.push(makeFan(gpu,-.90+i*.91,-.77,.83,.26));
gpuNamePlate=label(gpu,'RTX // GRAPHICS',1.9,.19,-.02,-.42,.79,{size:25});
const gpuStrip=box(gpu,2.46,.05,.05,-.02,-.35,.48,glowMaterial());lightBars.push(gpuStrip);
const glass=box(chassis,3.12,4.48,.025,0,.01,1.35,mats.glass);glass.material.depthWrite=false;glass.userData.glass=true;
const strip=box(chassis,.055,4.36,.055,-1.50,.06,1.18,glowMaterial());lightBars.push(strip);
tagMeshes(chassis,'case');for(const id of order.slice(1))tagMeshes(parts[id],id);
glass.visible=false;
const initialPositions={};for(const id of order)initialPositions[id]=parts[id].position.clone();

const STORAGE_KEY='unitlab3d_livebuild_v4';
function loadSnapshot(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))}catch{return null}}
const phpmoney=n=>'₱'+Number(n||0).toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2});
const safeText=x=>String(x||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function refreshQuickControls(snapshot){
 const container=$('#quickChoices');
 const choices=snapshot.choices||{};
 if(!choices.cpu||!choices.gpu||!choices.ram)return;
 let html='';
 for(const [key,title] of [['cpu','Processor'],['gpu','Graphics card'],['ram','System memory']]){
  const selected=snapshot.build?.[key]||'';
  html+='<label class="quick-label">'+title+'<select data-quick="'+key+'" class="quick-select">'+choices[key].map(p=>'<option value="'+safeText(p.id)+'" '+(selected===p.id?'selected':'')+'>'+safeText(p.name)+'</option>').join('')+'</select></label>';
 }
 container.innerHTML=html;
 container.querySelectorAll('[data-quick]').forEach(sel=>sel.addEventListener('change',e=>{
  const key=e.target.dataset.quick,id=e.target.value;
  if(window.parent!==window)window.parent.postMessage({type:'unitlab3d:choose',key,id},location.origin);
  else document.location.href='academy.html#builder';
 }));
}
function applyConfiguration(snapshot){
 if(!snapshot?.parts)return;
 liveSnapshot=snapshot;
 const p=snapshot.parts,gpuPart=p.gpu||{},ramPart=p.ram||{},cpuPart=p.cpu||{},psuPart=p.psu||{};
 const num=Math.max(1,Math.min(4,Number(ramPart.dimms)||2));
 // Two DIMMs populate alternating slots (A2/B2), four fill every slot.
 ramSticks.forEach((stick,i)=>stick.visible=num===4||i===1||i===3);
 const fans=Math.max(0,Math.min(3,Number(gpuPart.fans)||0));
 gpuFanModels.forEach((fan,i)=>{
  fan.visible=i<fans;
  if(fans===1)fan.position.x=0;
  else if(fans===2)fan.position.x=i===0?-.62:.62;
  else fan.position.x=-.90+i*.91;
 });
 gpu.visible=gpuPart.id!=='none';
 gpu.scale.x=gpuPart.id==='none'?1:Math.max(.7,Math.min(1.08,(gpuPart.length||250)/270));
 const text=(gpuPart.name||'RTX GRAPHICS').replace(/[^A-Za-z0-9 +]/g,' ').slice(0,30);
 if(gpuNamePlate){gpuNamePlate.material.map.dispose();gpuNamePlate.material.map=textTexture(text,{size:24});gpuNamePlate.material.needsUpdate=true}
 if(psuPart.capacity){const existing=parts.psu.getObjectByName('dynamicPsuLabel');if(existing){existing.parent.remove(existing);existing.geometry.dispose();existing.material.map?.dispose();existing.material.dispose()}
 const labelMesh=label(parts.psu,String(psuPart.capacity)+'W PSU',1.13,.2,.5,-2.11,.716,{size:26});labelMesh.name='dynamicPsuLabel';}
 const coolerType=(p.cooler?.id||'tower');
 const coolerFans=movingFans.filter(f=>f.parent.parent===cooler);
 // The cooler changes from a standard tower to a more open cooling accent for liquid-style choices.
 cooler.scale.set(coolerType==='aio240'?.96:1,coolerType==='stock'?.78:1,coolerType==='aio240'?.72:1);
 const gpuDisplay=gpuPart.name||'GPU';$('#partList [data-part="gpu"] b').textContent=gpuDisplay;
 $('#partList [data-part="ram"] b').textContent=(ramPart.name||'Memory')+' / '+num+' DIMMs';
 $('#partList [data-part="cpu"] b').textContent=cpuPart.name||'CPU';
 $('#configTotal').textContent=phpmoney(snapshot.priceTotal);
 if(state.selected==='gpu'){$('#partTitle').textContent=gpuDisplay;$('#partDesc').textContent=descriptions.gpu[1]+' Selected SKU: '+gpuDisplay+'. The visual fan count and model label follow this selection.'}
 if(state.selected==='ram'){$('#partTitle').textContent=ramPart.name||'Memory';$('#partDesc').textContent=descriptions.ram[1]+' Installed DIMMs: '+num+'.'}
 updateParts();refreshQuickControls(snapshot);
}
window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='unitlab3d:updatebuild')applyConfiguration(e.data.snapshot)});
window.addEventListener('storage',e=>{if(e.key===STORAGE_KEY){const snapshot=loadSnapshot();if(snapshot)applyConfiguration(snapshot)}});

function doExplode(){for(const id of order){if(id==='case')continue;const g=parts[id];g.position.copy(initialPositions[id]);const factor=({motherboard:0.25,cpu:0.8,cooler:1.8,ram:1.25,storage:1.1,psu:1.3,gpu:2.2})[id]||1;g.position.z+=state.explode*factor}}
function updateParts(){glass.visible=state.glass;for(const id of order){parts[id].visible=true}if(state.mode==='assemble'){const installed=new Set(assembly.slice(0,state.step).map(s=>s[0]));for(const id of order.slice(1))parts[id].visible=installed.has(id)}if(state.mode==='disassemble'){const removed=new Set(disassembly.slice(0,state.step).map(s=>s[0]));for(const id of order.slice(1))parts[id].visible=!removed.has(id)}doExplode()}
const list=$('#partList');
for(const id of order){const b=document.createElement('button');b.className='part';b.dataset.part=id;b.innerHTML='<b>'+descriptions[id][0]+'</b><span>Click to inspect →</span>';b.addEventListener('click',()=>select(id));list.appendChild(b)}
function select(id){state.selected=id;state.visited.add(id);$$('.part').forEach(b=>b.classList.toggle('active',b.dataset.part===id));$('#partTitle').textContent=descriptions[id][0];$('#partDesc').textContent=descriptions[id][1];$('#partSafety').textContent=descriptions[id][2];if(state.mode==='explore')$('#progressBar').style.width=(state.visited.size/order.length*100)+'%';$('#notice').textContent='Selected '+descriptions[id][0]}
function updateStep(){const mode=state.mode;$$('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));$('#modeStatus').textContent=mode.toUpperCase()+' MODE';const guided=mode!=='explore';$('#doStep').hidden=!guided||state.step===8;$('#restart').hidden=!guided;const items=mode==='assemble'?assembly:disassembly;$('#progressBar').style.width=((guided?state.step:state.visited.size)/8*100)+'%';if(guided){const row=items[state.step];$('#stepText').textContent=row?'Step '+(state.step+1)+' of '+items.length+': '+row[1]:'Sequence completed. Review the installed parts and repeat the procedure before a supervised physical lab.';if(row)select(row[0]);$('#doStep').textContent=mode==='assemble'?'Install selected part →':'Remove selected part →'}else{$('#stepText').textContent='Drag to rotate, click any component to read its role and safety notes. Use RGB and glass controls to explore the chassis.'}updateParts()}
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{state.mode=b.dataset.mode;state.step=0;updateStep()}));
$('#doStep').addEventListener('click',()=>{if(state.step<8)state.step++;updateStep()});
$('#restart').addEventListener('click',()=>{state.step=0;updateStep()});
$('#rgb').addEventListener('change',e=>{state.rgb=e.target.checked});$('#power').addEventListener('change',e=>{state.power=e.target.checked});
$('#glass').addEventListener('change',e=>{state.glass=e.target.checked;updateParts()});
$('#explode').addEventListener('input',e=>{state.explode=+e.target.value/100;doExplode()});
$('#resetCamera').addEventListener('click',()=>{camera.position.set(6.1,3.35,8.1);controls.target.set(0,.1,0);controls.update();state.explode=0;$('#explode').value=0;doExplode()});
const pickRay=new THREE.Raycaster(),mouse=new THREE.Vector2();let down=null;
$('#viewport').addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
$('#viewport').addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>8){down=null;return}down=null;const rect=renderer.domElement.getBoundingClientRect();mouse.x=(e.clientX-rect.left)/rect.width*2-1;mouse.y=-(e.clientY-rect.top)/rect.height*2+1;pickRay.setFromCamera(mouse,camera);const hits=pickRay.intersectObjects(assemblyRoot.children,true);const hit=hits.find(h=>h.object.userData.part&&h.object.userData.glass!==true);if(hit)select(hit.object.userData.part)});
const clock=new THREE.Clock(),col=new THREE.Color();
function resize(){const c=renderer.domElement,rect=c.getBoundingClientRect();if(rect.width<2||rect.height<2)return;const w=Math.floor(rect.width),h=Math.floor(rect.height);if(c.width!==Math.floor(w*renderer.getPixelRatio())||c.height!==Math.floor(h*renderer.getPixelRatio())){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}}
function animate(){requestAnimationFrame(animate);resize();const t=clock.getElapsedTime();controls.update();for(let i=0;i<movingFans.length;i++){if(state.power)movingFans[i].rotation.z+=.09}for(let i=0;i<lightBars.length;i++){const mesh=lightBars[i];const hue=(t*.11+i*.097)%1;mesh.material.color.setHSL(hue,1,.62);mesh.visible=state.rgb&&state.power}pinkLight.intensity=state.rgb&&state.power?36:3;edgeLight.intensity=state.rgb&&state.power?48:10;renderer.render(scene,camera)}
select('motherboard');updateStep();const initialSnapshot=loadSnapshot();if(initialSnapshot)applyConfiguration(initialSnapshot);animate();
