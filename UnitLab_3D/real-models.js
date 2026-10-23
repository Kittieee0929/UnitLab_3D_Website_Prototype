"use strict";
(()=>{
const $=s=>document.querySelector(s);
const ROOT='https://raw.githubusercontent.com/brickshow/pc-anatomy/main/public/models/';
const LOCAL_ASSETS={ram:'models/ram.glb',storage:'models/m2-ssd.glb',psu:'models/psu.glb'};
const models=[
 {id:'gpu',name:'Graphics Card',short:'GPU',file:'gpu.glb',size:'4.8 MB',desc:'Inspect the GPU cooler shroud, expansion bracket, fan housing and PCIe card form. Your RTX 4060 or RTX 5070 selection remains in the PC Builder; this is a representative graphics-card mesh.',safety:'Unplug the PC and release the PCIe slot latch. Support the card with your other hand, and use the correct power connectors.'},
 {id:'motherboard',name:'Motherboard',short:'MB',file:'motherboard.glb',size:'26.9 MB',desc:'Look closely at RAM slots, processor socket, PCIe slots, I/O ports, VRM heatsinks and onboard connectors. Compare to your chosen motherboard specification.',safety:'Handle by the edges and use school-approved ESD practice. Install standoffs before mounting.'},
 {id:'cpu',name:'CPU Processor',short:'CPU',file:'cpu.glb',size:'4.9 MB',desc:'Study the package shape, orientation markings and contact surface. AMD AM4 and AM5 packages differ, so the asset is for identification—not exact socket-fitting training.',safety:'Check the triangle alignment marks. Never push a processor into an incompatible socket.'},
 {id:'ram',name:'Memory / RAM',short:'DIMM',file:'ram.glb',size:'0.8 MB',desc:'Rotate a realistic DIMM model and inspect its contact edge and heatspreader. Your chosen 2×8GB, 2×16GB, 4×8GB or 4×16GB kit determines the actual module count.',safety:'Align the notch and seat evenly with retention clips. Never mix DDR4 and DDR5 slots.'},
 {id:'cooler',name:'CPU Cooling',short:'FAN',file:'cpu_fan.glb',size:'12.3 MB',desc:'Explore the cooler assembly, radiator or heatsink structure, fan geometry and brackets. The mesh is a representative product model.',safety:'Check mounting kit/socket support, thermal compound instructions and the CPU_FAN header.'},
 {id:'storage',name:'M.2 NVMe SSD',short:'NVMe',file:'m.2.glb',size:'0.2 MB',desc:'Examine a real 3D M.2 storage model, from gold-edge contacts to the mounting-end support.',safety:'Insert at the correct angle and secure with the correct screw, spacer or latch.'},
 {id:'psu',name:'Power Supply',short:'PSU',file:'psu.glb',size:'0.8 MB',desc:'Inspect the exterior of a power supply, ventilation, mains socket and connector area. Never open the enclosure.',safety:'Even when unplugged, internal PSU capacitors can be hazardous. Never open the PSU case.'},
 {id:'case',name:'Gaming PC Chassis',short:'CASE',file:'system_unit_update.glb',size:'23.8 MB',desc:'Inspect the complete tower form, panel geometry and room for components. Full-height assembly requires a compatible case for your motherboard and GPU.',safety:'Support heavy glass panels, keep case edges clear and check mounting points and cable routing.'},
 {id:'fans',name:'Case Fans',short:'RGB',file:'case_fans.glb',size:'1.3 MB',desc:'Inspect the fan mounting frame and rotor details. RGB lighting and the rotation direction are separate from the actual mechanical model.',safety:'Keep loose wires out of the blades; connect to a correct motherboard fan or RGB header.'},
 {id:'monitor',name:'Monitor',short:'LCD',file:'monitor.glb',size:'9.6 MB',desc:'Examine the external monitor used to confirm a successful assembly and initial boot.',safety:'Connect power and correct HDMI or DisplayPort input; never force incompatible ports.'},
 {id:'avr',name:'AVR / Voltage Regulator',short:'AVR',file:'avr.glb',size:'2.3 MB',desc:'Learn the difference between AVR input, output, and power controls for the classroom setup.',safety:'Follow the AVR manufacturer’s capacity, voltage and grounding guidance; do not daisy-chain distribution outlets.'},
 {id:'hdd',name:'Hard Disk Drive',short:'HDD',file:'hdd.glb',size:'7.5 MB',desc:'Examine the drive body and SATA connection zone. Compare with the M.2 NVMe form factor.',safety:'Do not open a storage drive or handle it while powered. Prevent static discharge and impacts.'},
 {id:'full',name:'Full PC Build',short:'PC',file:'system_unit.glb',size:'1.3 MB',desc:'Rotate an entire system unit to orient the external case, panels and airflow in three dimensions.',safety:'Identify safe power isolation points before opening or moving a PC.'}
];
let current='gpu',timer=null,lastURL='';
const viewing=$('#actualModel'),panel=$('#loading');
const query=new URLSearchParams(location.search);
let prior=query.get('part');if(prior&&models.some(m=>m.id===prior))current=prior;
function currentModel(){return models.find(m=>m.id===current)||models[0]}
function selectedBuild(){try{return JSON.parse(localStorage.getItem('unitlab3d_livebuild_v4')||'null')}catch{return null}}
function reportBuild(){
const b=selectedBuild();
$('#priceTotal').textContent=b&&Number.isFinite(+b.priceTotal)?'₱'+Number(b.priceTotal).toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2}):'No saved build';
const parts=b?.parts||{};
$('#buildSpecs').textContent=b?[parts.cpu?.name,parts.gpu?.name,parts.ram?.name].filter(Boolean).join(' • ')||'Build your computer in the PC Builder.':'Choose parts in PC Builder and come back to see your price here.';
}
function showStatus(msg,loading=true){
panel.hidden=false;
panel.innerHTML='';
if(loading){const s=document.createElement('span');s.className='spinner';panel.appendChild(s)}
const text=document.createElement('div');text.textContent=msg;panel.appendChild(text);
if(!loading){const link=document.createElement('a');link.className='btn';link.href='worklab-pro.html?part='+encodeURIComponent(current)+'&solo=1';link.textContent='Open fallback viewer →';link.style.cssText='display:inline-block;margin-top:10px';panel.appendChild(link)}
}
function inventory(){
const root=$('#parts');root.innerHTML='';
for(const m of models){
const b=document.createElement('button');b.className='part'+(m.id===current?' active':'');b.dataset.part=m.id;b.setAttribute('aria-label','View 3D model: '+m.name);
const icon=document.createElement('span');icon.className='chip';icon.textContent=m.short;
const content=document.createElement('span');const title=document.createElement('strong');title.textContent=m.name;const secondary=document.createElement('small');secondary.textContent=m.size+' · 360° GLB';content.append(title,secondary);b.append(icon,content);
b.addEventListener('click',()=>select(m.id));root.appendChild(b)
}
$('#partCount').textContent=models.length+' MODELS';
}
let loadSequence=0;
function select(id){
const m=models.find(x=>x.id===id);if(!m)return;
current=m.id;loadSequence++;clearTimeout(timer);
$$('.part').forEach(b=>b.classList.toggle('active',b.dataset.part===id));
$('#partName').textContent=m.name;$('#partDesc').textContent=m.desc;$('#partSafety').textContent=m.safety;$('#meshLabel').textContent=m.size+' model';
$('#cornerName').textContent='◉ ACTUAL TEXTURED GLB • '+m.name.toUpperCase();
showStatus('Loading '+m.name+' · '+m.size+'…');
const url=LOCAL_ASSETS[m.id]||ROOT+encodeURIComponent(m.file).replace(/%2E/gi,'.');
lastURL=url;
viewing.setAttribute('alt','Interactive textured 3D model of '+m.name);
viewing.setAttribute('src',url);
const seq=loadSequence;
timer=setTimeout(()=>{if(seq===loadSequence){showStatus('This model is taking longer than expected. Check connection or use the fallback viewer.',false)}},43000);
try{history.replaceState(null,'','real-models.html?part='+encodeURIComponent(id))}catch{}
}
function errorHandler(){
clearTimeout(timer);
showStatus('Could not load the model. The 3D source or graphics engine may be blocked. You can still use the other learning activities.',false)
}
function init(){
inventory();reportBuild();
viewing.addEventListener('load',()=>{clearTimeout(timer);panel.hidden=true});
viewing.addEventListener('error',errorHandler);
viewing.addEventListener('progress',e=>{
const total=e?.detail?.totalProgress;
if(typeof total==='number'&&total>0&&total<1){$('#loadingText')?.replaceChildren(document.createTextNode('Loading model '+Math.round(total*100)+'%'))}
});
$('#spinBtn').addEventListener('click',()=>{
const enabled=viewing.hasAttribute('auto-rotate');
viewing.toggleAttribute('auto-rotate',!enabled);
$('#spinBtn').textContent=enabled?'Start rotation':'Pause rotation'
});
$('#resetBtn').addEventListener('click',()=>{
viewing.cameraOrbit='0deg 75deg auto';viewing.fieldOfView='30deg';viewing.jumpCameraToGoal?.()
});
window.addEventListener('storage',e=>{if(e.key==='unitlab3d_livebuild_v4')reportBuild()});
customElements.whenDefined('model-viewer').then(()=>select(current)).catch(errorHandler);
setTimeout(()=>{if(!customElements.get('model-viewer'))showStatus('Your browser could not load the 3D model engine. Check connection or choose the fallback.',false)},14000);
}
const $$=s=>Array.from(document.querySelectorAll(s));
document.addEventListener('DOMContentLoaded',init);
})();