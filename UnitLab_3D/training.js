"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const items=[
 {id:'esd',name:'ESD wrist strap',tag:'Safety tool',icon:'ESD',kind:'tools',target:'safety',details:'Reduce electrostatic discharge using the approved anti-static work procedure. Always disconnect the PC from mains power before handling hardware.',label:'SAFE BENCH'},
 {id:'motherboard',name:'Motherboard',tag:'Mainboard',icon:'MB',kind:'parts',target:'motherboard',details:'The circuit board connecting CPU, RAM, GPU and storage. Check mounting standoff placement before fitting.',label:'MAINBOARD'},
 {id:'cpu',name:'Processor / CPU',tag:'AM4 / AM5 socket',icon:'CPU',kind:'parts',target:'cpu',details:'The processor handles instructions. Socket compatibility, alignment and BIOS support are required.',label:'CPU'},
 {id:'cooler',name:'CPU cooler',tag:'Air or liquid cooling',icon:'FAN',kind:'parts',target:'cooler',details:'Heat dissipation from CPU through an approved heatsink or liquid radiator. Use the matching mounting kit.',label:'COOLER'},
 {id:'ram',name:'RAM DIMM kit',tag:'DDR4 / DDR5',icon:'RAM',kind:'parts',target:'ram',details:'Temporary computer memory. DIMM module quantity and DDR generation must match the motherboard.',label:'RAM'},
 {id:'storage',name:'NVMe SSD',tag:'M.2 drive',icon:'SSD',kind:'parts',target:'storage',details:'Nonvolatile storage for operating system and files. Secure the M.2 device correctly.',label:'SSD'},
 {id:'psu',name:'Power supply unit',tag:'ATX supply',icon:'PSU',kind:'parts',target:'psu',details:'Converts AC input to DC rails used by the computer. Never open the PSU housing.',label:'PSU'},
 {id:'gpu',name:'Graphics card',tag:'PCI Express',icon:'GPU',kind:'parts',target:'gpu',details:'Dedicated GPU for display and graphics tasks; secure it in PCIe x16 slot and use the required cable.',label:'GPU'},
 {id:'fanCable',name:'CPU fan lead',tag:'Fan header cable',icon:'FAN',kind:'cables',target:'fanCable',details:'Connect CPU fan lead to the recommended CPU_FAN header and route clear of moving blades.',label:'CPU FAN'},
 {id:'power24',name:'24-pin ATX cable',tag:'Motherboard power',icon:'24P',kind:'cables',target:'power24',details:'Main motherboard power connector. Align retention latch; do not use force.',label:'24-PIN'},
 {id:'powerCpu',name:'8-pin CPU EPS cable',tag:'Processor power',icon:'EPS',kind:'cables',target:'powerCpu',details:'Connect proper CPU EPS power cable, not a superficially similar PCIe cable.',label:'CPU EPS'},
 {id:'powerGpu',name:'PCIe GPU power cable',tag:'Graphics power',icon:'GPU',kind:'cables',target:'powerGpu',details:'Use exact graphics-card connector and PSU or authorized adapter. RTX 5070 examples may require 16-pin power.',label:'GPU PWR'},
 {id:'avrPlug',name:'AVR input power cord',tag:'AVR to rated grounded outlet',icon:'AC',kind:'cables',target:'avrPlug',details:'The AVR must be properly rated and connected according to its manual. Do not daisy-chain power strips.',label:'AVR IN'},
 {id:'pcCord',name:'PC AC power cord',tag:'PC to rated AVR output',icon:'AC',kind:'cables',target:'pcCord',details:'Connect the PSU AC cable to a suitably rated AVR output. This is a virtual simulation of the cable connection.',label:'PC AC'},
 {id:'monitorCord',name:'Monitor power cord',tag:'Monitor to rated AVR output',icon:'AC',kind:'cables',target:'monitorCord',details:'Connect monitor power according to its manual and verify voltage rating.',label:'LCD AC'},
 {id:'video',name:'HDMI / DisplayPort cable',tag:'Video output to monitor',icon:'DP',kind:'cables',target:'video',details:'Connect a supported video cable from GPU output to monitor input. If no dedicated GPU, use CPU-integrated graphics through motherboard port.',label:'VIDEO'},
 {id:'avrSwitch',name:'AVR power button',tag:'Turn AVR on',icon:'AVR',kind:'power',target:'avrSwitch',details:'Switch on the correctly rated AVR after cable setup and pre-power checks.',label:'AVR ON'},
 {id:'monitorSwitch',name:'Monitor power button',tag:'Turn monitor on',icon:'LCD',kind:'power',target:'monitorSwitch',details:'Power on the display, select correct HDMI/DP input source in monitor menu.',label:'LCD ON'},
 {id:'pcSwitch',name:'PC power button',tag:'Initial boot',icon:'PWR',kind:'power',target:'pcSwitch',details:'Power the PC only after verification; teacher supervises the first start-up and BIOS checks.',label:'PC ON'},
 {id:'screwdriver',name:'Phillips screwdriver',tag:'Tool for fasteners',icon:'TOOL',kind:'tools',target:null,details:'Use to fasten components with correct size. Not a substitute for cables, slots, or power operations.',label:'TOOL'},
 {id:'partsTray',name:'Screw organizer tray',tag:'Fastener storage',icon:'TRAY',kind:'tools',target:null,details:'Organizes and protects screws and standoffs. Separate common thread sizes.',label:'TRAY'},
 {id:'pliers',name:'Needle-nose pliers',tag:'Only when appropriate',icon:'PLY',kind:'tools',target:null,details:'Handle approved small components gently. Avoid force near live circuits or fragile connectors.',label:'PLIERS'}
];
const required=items.filter(i=>i.target!==null),byId=Object.fromEntries(items.map(i=>[i.id,i])),byZone=Object.fromEntries(required.map(i=>[i.target,i]));
const safetyDeps={
motherboard:['esd'],cpu:['motherboard','esd'],cooler:['cpu'],ram:['motherboard'],storage:['motherboard'],gpu:['motherboard','psu'],fanCable:['cooler'],power24:['psu','motherboard'],powerCpu:['psu','cpu'],powerGpu:['psu','gpu'],pcCord:['psu'],monitorCord:['avrPlug'],avrSwitch:['avrPlug','pcCord','monitorCord'],monitorSwitch:['avrSwitch','monitorCord','video'],pcSwitch:['avrSwitch','monitorSwitch','power24','powerCpu','fanCable','video']
};
const state={mode:'tutorial',current:0,selected:null,placed:{},attempts:[],started:Date.now(),submitted:false,activity:0,completed:0,visited:new Set()};
function inCurrentAccount(){return sessionStorage.getItem('unitlab3d_student_demo')||sessionStorage.getItem('unitlab_student')||'Guest'}
function settings(){const snap=JSON.parse(localStorage.getItem('unitlab3d_livebuild_v4')||'null');return snap?.parts||{}}
function actionSequence(){return required.filter(i=>!(settings().gpu?.id==='none'&&['gpu','powerGpu'].includes(i.id)))}
function label(text){return String(text||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function setGuide(item){if(!item)return;$('#guideName').textContent=item.name;$('#guideDetails').textContent=item.details;$('#miniText').textContent=item.icon;const modelMap={motherboard:'motherboard.glb',cpu:'cpu.glb',cooler:'cpu_fan.glb',ram:'ram.glb',storage:'m.2.glb',psu:'psu.glb',gpu:'gpu.glb',case:'system_unit_update.glb'};const asset=modelMap[item.id];const partView=$('#openPart3D');if(partView){partView.href='real-models.html?part='+encodeURIComponent(item.id);partView.hidden=!asset}const live=$('#guideRealModel'),fallback=$('#miniShape');if(live){live.style.display='none';fallback.style.display='grid';if(asset){live.setAttribute('src','https://raw.githubusercontent.com/brickshow/pc-anatomy/main/public/models/'+asset);live.setAttribute('alt','Real rotating 3D model of '+item.name)}else live.removeAttribute('src')}const object=$('#miniShape');object.style.background={cpu:'linear-gradient(135deg,#b1b2c3,#394d68)',motherboard:'linear-gradient(135deg,#367e78,#123e49)',ram:'linear-gradient(135deg,#39795a,#133a2f)',gpu:'linear-gradient(135deg,#58647f,#172434)',psu:'linear-gradient(135deg,#647083,#18263b)',cooler:'linear-gradient(135deg,#8e9aa8,#344a56)',storage:'linear-gradient(135deg,#2e9c9d,#145463)'}[item.id]||'linear-gradient(135deg,#477e94,#133c58)';}
function renderCabinet(){const sections={tools:[],parts:[],cables:[],power:[]};items.forEach(item=>sections[item.kind].push(item));
const root=$('#cabinet');root.innerHTML='';Object.entries(sections).forEach(([kind,list])=>{const shelf=document.createElement('section');shelf.className='shelf';shelf.innerHTML='<h3>'+({tools:'TOOLS & SAFETY',parts:'PC HARDWARE',cables:'CABLES & PLUGS',power:'OPERATE & POWER ON'}[kind])+'</h3>';
list.forEach(item=>{const b=document.createElement('button');b.type='button';b.className='item';b.draggable=true;b.dataset.item=item.id;b.innerHTML='<span class="glyph part-icon">'+label(item.icon)+'</span><span><b>'+label(item.name)+'</b><small>'+label(item.tag)+'</small></span>';
b.addEventListener('click',()=>{state.selected=item.id;setGuide(item);updateHighlights();$('#selectedPartLabel').textContent=item.name});
b.addEventListener('dragstart',e=>{state.selected=item.id;setGuide(item);e.dataTransfer.setData('text/plain',item.id);e.dataTransfer.effectAllowed='move';updateHighlights()});
shelf.append(b)});root.append(shelf)});
}
function renderBoard(){const zones=$$('[data-zone]');for(const b of zones){b.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move';b.classList.add('hover')});b.addEventListener('dragleave',()=>b.classList.remove('hover'));b.addEventListener('drop',e=>{e.preventDefault();b.classList.remove('hover');place(e.dataTransfer.getData('text/plain'),b.dataset.zone)});b.addEventListener('click',()=>{if(state.selected)place(state.selected,b.dataset.zone)})}updateBoard()}
function shouldBeActive(id){return actionSequence().some(i=>i.id===id)}
function updateBoard(){for(const b of $$('[data-zone]')){const zone=b.dataset.zone;const itemId=state.placed[zone];const item=byId[itemId];b.classList.toggle('filled',!!item);b.classList.remove('wrong-placement');b.replaceChildren();if(item){const v=document.createElement('span');v.className='installed';v.textContent=item.label;b.appendChild(v);if(item.target!==zone)b.classList.add('wrong-placement')}else b.textContent=(byZone[zone]||{label:zone}).label;}
const avr=state.placed.avrSwitch==='avrSwitch'&&state.placed.avrPlug==='avrPlug';const monitor=avr&&state.placed.monitorCord==='monitorCord'&&state.placed.monitorSwitch==='monitorSwitch';const pc=avr&&state.placed.pcCord==='pcCord'&&state.placed.pcSwitch==='pcSwitch'&&state.placed.power24==='power24'&&state.placed.powerCpu==='powerCpu';$('#avrLed').style.background=avr?'#71f2be':'#5d7b83';$('#avrLed').style.boxShadow=avr?'0 0 15px #6affb4':'none';$('#screenStatus').textContent=monitor?(pc?'SIGNAL / BOOT':'MONITOR ON'):'MONITOR OFF';$('#screenStatus').style.color=monitor?'#7bf4c9':'#84e8e8';
$('#onBenchCount').textContent=Object.keys(state.placed).length+' items placed';
}
function stepText(){const actions=actionSequence(),step=actions[state.current];if(state.mode==='tutorial'){if(step){$('#lessonTag').textContent='GUIDED / STEP '+(state.current+1);$('#lessonTitle').textContent='Follow the glowing trail';$('#lessonText').textContent='Find “'+step.name+'” in the cabinet. Place it in the highlighted '+step.label+' location. '+step.details}else{$('#lessonTag').textContent='GUIDED TRAINING COMPLETE';$('#lessonTitle').textContent='Ready for your skills test';$('#lessonText').textContent='You finished the demonstration. Switch to Performance Test to repeat all tasks without a glowing trail or corrections.'}}
else {$('#lessonTag').textContent='ASSESSMENT / NO HINTS';$('#lessonTitle').textContent='Independent performance';$('#lessonText').textContent=state.submitted?'Assessment submitted. Review your checklist below.':'Place tools, parts, cables and turn on the computer when ready. No guidance, immediate correction or correctness feedback will appear. Errors are recorded for your final practice grade.'}
const completed=state.mode==='tutorial'?state.current:Math.min(actions.length,Object.keys(state.placed).length);
$('#progressBar').style.width=(completed/actions.length*100)+'%';
$('#progressLabel').textContent=state.mode==='tutorial'?completed+' / '+actions.length+' tutorial actions completed':state.attempts.length+' recorded attempts · '+Object.keys(state.placed).length+' occupied stations';
$('#finishTest').hidden=state.mode!=='performance'||state.submitted;
$('#startNew').hidden=state.mode!=='performance'||!state.submitted;
}
function updateHighlights(){
const guide=state.mode==='tutorial'?actionSequence()[state.current]:null;
$$('.slot').forEach(b=>b.classList.toggle('guide',!!guide&&b.dataset.zone===guide.target));
$$('.item').forEach(b=>{b.classList.toggle('good-hint',!!guide&&b.dataset.item===guide.id);b.classList.toggle('selected',b.dataset.item===state.selected)});
}
function place(id,zone){
if(state.submitted||!byId[id]||!byZone[zone])return;
const item=byId[id];
state.visited.add(id);state.activity++;
const previous=state.placed[zone]||null;
const valid=item.target===zone;
const deps=(safetyDeps[id]||[]).filter(dep=>shouldBeActive(dep)&&state.placed[byId[dep]?.target]!==dep);
const action=actionSequence()[state.current];
if(state.mode==='tutorial'){
 if(!action||id!==action.id||zone!==action.target){$('#lessonText').textContent='Follow the glowing trail: choose '+(action?.name||'the next item')+' and place it in '+(action?.label||'its intended position')+'.';return}
 state.placed[zone]=id;state.current++;state.selected=null;setGuide(item);updateBoard();stepText();updateHighlights();return;
}
// PERFORMANCE: deliberately show no correctness feedback. Keep the placed item even if it is wrong.
state.attempts.push({item:id,zone,valid,previous,dependentCount:deps.length,dependencyIds:deps,at:Date.now()});
state.placed[zone]=id;state.selected=null;setGuide(item);updateBoard();stepText();updateHighlights();
}
function setMode(mode){
state.mode=mode;state.current=0;state.selected=null;state.placed={};state.attempts=[];state.submitted=false;state.started=Date.now();state.activity=0;state.visited=new Set();
$$('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));$('#result').innerHTML='';setGuide(items[0]);updateBoard();stepText();updateHighlights();
}
function escapeCsv(x){return '"'+String(x??'').replace(/"/g,'""')+'"'}
function csvRows(rows){return rows.map(arr=>arr.map(escapeCsv).join(',')).join('\r\n')}
function resultData(){
const actions=actionSequence();const firstTry=new Map();
for(const a of state.attempts){if(!firstTry.has(a.item))firstTry.set(a.item,a)}
const rows=actions.map(item=>{const first=firstTry.get(item.id);const final=state.placed[item.target]===item.id;const rightFirst=first?.valid&&first.dependentCount===0;return {item:item.id,name:item.name,zone:item.target,completed:final,firstTry:!!rightFirst,attempts:state.attempts.filter(a=>a.item===item.id).length,penalty:!final?4:(!rightFirst?3:0)}});
const wrongDrops=state.attempts.filter(a=>!a.valid).length,unsafe=state.attempts.filter(a=>a.dependentCount>0).length;
const missing=rows.filter(r=>!r.completed).length;
const late=rows.filter(r=>r.completed&&!r.firstTry).length;
const grade=Math.max(0,100-Math.min(100,wrongDrops*4+unsafe*6+missing*4+late*2));
return {mode:state.mode,grade,rows,wrongDrops,unsafe,missing,late,tries:state.attempts.length,timestamp:new Date().toISOString()};
}
function submit(){
if(state.mode!=='performance'||state.submitted)return;
state.submitted=true;
const result=resultData(),code=inCurrentAccount();
const key='unitlab3d_practice_reports_'+code;
let previous=[];try{previous=JSON.parse(localStorage.getItem(key)||'[]')}catch{}
previous.push(result);localStorage.setItem(key,JSON.stringify(previous.slice(-30)));
const short=result.rows.map(row=>'<tr><td>'+label(row.name)+'</td><td>'+(row.completed?'Placed':'Missing')+'</td><td>'+(row.firstTry?'Pass':'Needs improvement')+'</td><td>'+row.attempts+'</td></tr>').join('');
$('#result').innerHTML='<div class="score-box"><div class="tag">PRACTICE RESULT / LOCAL BROWSER ONLY</div><strong>'+result.grade+' / 100</strong><p class="small">Wrong drops: '+result.wrongDrops+' · Unsafe/out-of-sequence actions: '+result.unsafe+' · Missing required items: '+result.missing+' · Tasks not correct first try: '+result.late+'</p><table><thead><tr><th>Checklist</th><th>Status</th><th>First try</th><th>Tries</th></tr></thead><tbody>'+short+'</tbody></table><p class="small">The system kept your mistakes during the test; no automatic corrections were made.</p><button class="btn outline" id="exportReport" style="margin-top:9px">Download grade & checklist CSV</button></div>';
$('#exportReport').addEventListener('click',()=>{const lines=[['UnitLab practice result',result.timestamp],['Learner code',code],['Practice grade',result.grade],['Wrong placements',result.wrongDrops],['Unsafe/out-of-sequence',result.unsafe],['Missing tasks',result.missing],[],['Task','Final placement','Correct first attempt','Attempts'],...result.rows.map(r=>[r.name,r.completed?'Placed':'Missing',r.firstTry?'Yes':'No',r.attempts])];const blob=new Blob(['\ufeff'+csvRows(lines)],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='UnitLab_Practice_Report_'+new Date().toISOString().slice(0,10)+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)});
stepText();updateHighlights();
}
function boot(){
renderCabinet();renderBoard();$('#learnerStatus').textContent=inCurrentAccount()==='Guest'?'Guest practice — local only':'Local demo: '+inCurrentAccount();
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
$('#resetMode').addEventListener('click',()=>setMode(state.mode));
const realGuide=$('#guideRealModel');if(realGuide){realGuide.addEventListener('load',()=>{realGuide.style.display='block';$('#miniShape').style.display='none'});realGuide.addEventListener('error',()=>{realGuide.style.display='none';$('#miniShape').style.display='grid'})}$('#spinModel').addEventListener('click',()=>{const live=$('#guideRealModel');if(live&&live.style.display==='block'){const rotating=live.hasAttribute('auto-rotate');live.toggleAttribute('auto-rotate',!rotating);$('#spinModel').textContent=rotating?'▶ Rotate preview':'⟳ Pause rotation'}else $('#miniShape').classList.toggle('spin')});
$('#finishTest').addEventListener('click',submit);
$('#startNew').addEventListener('click',()=>setMode('performance'));
setMode('tutorial');
}
document.addEventListener('DOMContentLoaded',boot);