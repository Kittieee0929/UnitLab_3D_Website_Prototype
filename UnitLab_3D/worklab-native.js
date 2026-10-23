"use strict";
(function(){
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const names={
case:['Case / chassis','Encloses the computer and provides mounting points, airflow and cable routing.','Handle glass panels carefully and check metal edges.'],
motherboard:['Motherboard','Connects the CPU, memory, GPU, power and storage.','Use ESD precautions and align the correct standoffs.'],
cpu:['CPU / processor','Executes instructions and requires the correct socket and BIOS support.','Never force a CPU into its socket.'],
cooler:['CPU cooler','Removes heat from the processor using heatsinks or a fan.','Install the mounting hardware and CPU fan connector correctly.'],
ram:['RAM / memory','Temporary working memory: use two or four DIMMs as configured.','DDR4/DDR5 must match the board. Align each DIMM notch.'],
storage:['M.2 SSD','Nonvolatile system and application storage.','Use the correct M.2 support screw or clip.'],
gpu:['Graphics card','Accelerates display and rendering with a dedicated GPU.','Support the card, release PCIe latch and connect proper power.'],
psu:['Power supply','Supplies regulated DC power to internal components.','Never open a PSU housing; disconnect mains before work.']
};
const order=['case','motherboard','cpu','cooler','ram','storage','psu','gpu'],reverse=[...order].reverse();
const canvas=$('#pc3d'),fallback=$('#webglFail');
let gl=null;try{gl=canvas.getContext('webgl',{alpha:false,antialias:true})||canvas.getContext('experimental-webgl')}catch(e){}
if(!gl){fallback.hidden=false;return}
function makeShader(type,code){const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
let program;
try{
program=gl.createProgram();
gl.attachShader(program,makeShader(gl.VERTEX_SHADER,'attribute vec3 aPos; attribute vec3 aNormal; uniform mat4 uPV; uniform mat4 uModel; varying vec3 vNormal; void main(){vNormal=mat3(uModel)*aNormal;gl_Position=uPV*uModel*vec4(aPos,1.0);}'));
gl.attachShader(program,makeShader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec3 vNormal;uniform vec3 uColor;uniform float uGlow;uniform float uAlpha;void main(){float light=.55+max(dot(normalize(vNormal),normalize(vec3(.4,.7,1.))),0.)*.75;gl_FragColor=vec4(uColor*(light+uGlow),uAlpha);}'));
gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
}catch(err){fallback.hidden=false;fallback.querySelector('p').textContent='WebGL could not initialize: '+err.message;return}
gl.useProgram(program);
const uPV=gl.getUniformLocation(program,'uPV'),uModel=gl.getUniformLocation(program,'uModel'),uColor=gl.getUniformLocation(program,'uColor'),uGlow=gl.getUniformLocation(program,'uGlow'),uAlpha=gl.getUniformLocation(program,'uAlpha');
const positions=[],normals=[];
function face(a,b,c,d,n){for(const p of [a,b,c,a,c,d]){positions.push(...p);normals.push(...n)}}
face([-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5],[0,0,1]);
face([.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5],[0,0,-1]);
face([-.5,-.5,-.5],[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5],[-1,0,0]);
face([.5,-.5,.5],[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5],[1,0,0]);
face([-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5],[-.5,.5,-.5],[0,1,0]);
face([-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,.5],[0,-1,0]);
function buffer(attribute,data){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,3,gl.FLOAT,false,0,0)}
buffer(gl.getAttribLocation(program,'aPos'),positions);
buffer(gl.getAttribLocation(program,'aNormal'),normals);
gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(.025,.054,.087,1);
const mat=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
function mult(a,b){const o=new Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o}
function T(x,y,z){const m=mat();m[12]=x;m[13]=y;m[14]=z;return m}
function S(x,y,z){const m=mat();m[0]=x;m[5]=y;m[10]=z;return m}
function R(a){const m=mat(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[4]=-s;m[1]=s;m[5]=c;return m}
function norm(v){const l=Math.hypot(...v)||1;return v.map(x=>x/l)}
const sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function lookAt(eye,look){const z=norm(sub(eye,look)),x=norm(cross([0,1,0],z)),y=cross(z,x),m=mat();m[0]=x[0];m[4]=x[1];m[8]=x[2];m[1]=y[0];m[5]=y[1];m[9]=y[2];m[2]=z[0];m[6]=z[1];m[10]=z[2];m[12]=-dot(x,eye);m[13]=-dot(y,eye);m[14]=-dot(z,eye);return m}
function persp(aspect){const f=1/Math.tan(.36),near=.1,far=50,o=new Array(16).fill(0);o[0]=f/aspect;o[5]=f;o[10]=(far+near)/(near-far);o[11]=-1;o[14]=2*far*near/(near-far);return o}
function project(m,v){const [x,y,z]=v;return [m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14],m[3]*x+m[7]*y+m[11]*z+m[15]]}
const hex=h=>[((h>>16)&255)/255,((h>>8)&255)/255,(h&255)/255],state={yaw:.63,pitch:.23,zoom:8.5,selected:'motherboard',visited:new Set(),mode:'explore',step:0,rgb:true,glass:false,power:true,explode:0,solo:false};
const storeKey='unitlab3d_livebuild_v4';
function load(){try{return JSON.parse(localStorage.getItem(storeKey))}catch{return null}}
let build=load();let pickPoints=[],PV=mat();
function visible(id){if(state.solo)return id===state.selected;if(state.mode==='explore')return true;if(state.mode==='assemble')return id==='case'||order.slice(0,state.step).includes(id);return !reverse.slice(0,state.step).includes(id)}
function ex(id){return id==='case'?0:(state.explode*(id==='gpu'?2.3:id==='cooler'?1.7:1.1))}
function cube(x,y,z,w,h,d,color,id='case',glow=0,angle=0,alpha=1){
if(!visible(id))return;
const model=mult(T(x+ex(id)*.22,y,z+ex(id)),mult(R(angle),S(w,h,d)));
gl.uniformMatrix4fv(uModel,false,new Float32Array(model));
gl.uniform3fv(uColor,new Float32Array(hex(color)));
gl.uniform1f(uGlow,glow+(id===state.selected?.12:0));
gl.uniform1f(uAlpha,alpha);
gl.drawArrays(gl.TRIANGLES,0,36);
}
function fan(x,y,z,r,color,t,id='case'){
cube(x,y,z,.14,.14,.12,0xa6bfcc,id);
for(let n=0;n<12;n++){const a=n*Math.PI/6;cube(x+Math.cos(a)*r,y+Math.sin(a)*r,z,.17,.13,.07,color,id,state.rgb&&state.power?.55:0,a)}
if(state.power)for(let n=0;n<7;n++){const a=t*2+n*2*Math.PI/7;cube(x+Math.cos(a)*r*.4,y+Math.sin(a)*r*.4,z+.08,.11,r*.75,.035,0x81a9bb,id,.05,a)}
}
function details(){const p=build?.parts||{},ram=p.ram||{},gpu=p.gpu||{};return {ram:ram.dimms||2,fans:gpu.id==='none'?0:(gpu.fans||2),gpusize:Math.min(1.1,Math.max(.6,(gpu.length||250)/270)),cooler:p.cooler?.id||'tower'}}
function render(time){
const dpr=Math.min(devicePixelRatio||1,2),rect=canvas.getBoundingClientRect(),w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));
if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
const eye=[Math.sin(state.yaw)*Math.cos(state.pitch)*state.zoom,Math.sin(state.pitch)*state.zoom,Math.cos(state.yaw)*Math.cos(state.pitch)*state.zoom];
PV=mult(persp(w/h),lookAt(eye,[0,0,0]));gl.uniformMatrix4fv(uPV,false,new Float32Array(PV));
const data=details(),on=state.rgb&&state.power,t=time*.001;
const glow=n=>on?[0x69e8e0,0xc58dff,0x68aaf9,0xff83b6][n%4]:0x5e7783;
pickPoints=[];
function pick(id,x,y,z,r=.5){const v=project(PV,[x+ex(id)*.22,y,z+ex(id)]);if(v[3]<=0)return;pickPoints.push({id,x:(v[0]/v[3]*.5+.5)*rect.width,y:(-v[1]/v[3]*.5+.5)*rect.height,r:Math.max(22,r*rect.height/6)})}
// Case shell, ventilation, supports
cube(0,0,-.9,3.75,4.9,.16,0x293d4d);cube(-1.83,0,0,.15,4.9,1.9,0x122531);cube(1.83,0,0,.15,4.9,1.9,0x172b3d);
cube(0,2.47,0,3.82,.17,1.91,0x273e51);cube(0,-2.49,0,3.82,.18,1.91,0x182b3a);
cube(0,-2.06,.06,3.61,.72,1.73,0x1a2c3a);cube(-1.35,-2.58,-.47,.32,.19,.67,0x182432);cube(1.35,-2.58,-.47,.32,.19,.67,0x182432);
for(let i=0;i<3;i++)fan(1.32,1.25-i*1.24,.92,.35,glow(i),t);
fan(-1.48,1.50,.55,.29,glow(3),t);
if(on)cube(-1.69,0,.79,.06,4.30,.05,glow(1),'case',.5);
pick('case',-1.3,0,.65,1.0);
// Motherboard and etched circuit traces
cube(-.35,.40,-.47,2.54,3.39,.14,0x1b5557,'motherboard');
for(let i=0;i<25;i++)cube(-1.33+i%5*.47,-.91+Math.floor(i/5)*.58,-.33,.25,.032,.026,i%4===0?0xb98a5a:0x7e9ba1,'motherboard');
for(let i=0;i<8;i++)cube(-1.39+i*.31,1.89,-.41,.12,.16,.14,0x97bbc0,'motherboard');
pick('motherboard',-.55,.45,-.33,1);
// CPU
cube(-.61,.82,-.24,.79,.79,.12,0xc3cdd5,'cpu');cube(-.61,.82,-.15,.61,.61,.09,0x3c6373,'cpu');pick('cpu',-.61,.82,-.13,.45);
// CPU air or AIO cooler
if(data.cooler==='aio240'){cube(-.61,.85,.20,.69,.7,.27,0x2f485a,'cooler');fan(-.61,.85,.36,.24,glow(1),t,'cooler')}
else{for(let i=0;i<(data.cooler==='stock'?5:11);i++)cube(-.61,.30+i*.11,.08,1.06,.052,.69,0x9ab3c1,'cooler');fan(-.61,.84,.51,.36,glow(1),t,'cooler')}pick('cooler',-.61,.83,.56,.54);
// DIMMs two or four, only two alternating when 2-stick
for(let i=0;i<4;i++){cube(.35+i*.18,1.03,-.23,.06,1.51,.11,0x3a4b56,'motherboard');if(data.ram===4||i===1||i===3){cube(.35+i*.18,1.03,-.08,.13,1.48,.11,0x21665a,'ram');cube(.35+i*.18,1.73,-.06,.14,.1,.13,glow(i),'ram',on?.60:0)}}pick('ram',.62,1.05,-.05,.52);
// M.2 NVMe storage
cube(-.32,-.31,-.25,.89,.23,.08,0x28746d,'storage');for(let i=0;i<4;i++)cube(-.63+i*.18,-.30,-.19,.10,.12,.022,0x8baab4,'storage');pick('storage',-.32,-.3,-.13,.44);
// GPU approximate length and number of fans, model-specific from PC Builder
if(data.fans>0){cube(-.10,-.75,.56,2.8*data.gpusize,.65,.72,0x263848,'gpu');cube(-.10,-.42,.56,2.85*data.gpusize,.09,.73,0x6a8492,'gpu');
for(let i=0;i<data.fans;i++){const x=-.1+(i-(data.fans-1)/2)*(data.fans===1?0:2*data.gpusize/(data.fans-1));fan(x,-.77,.95,.19,glow(i),t,'gpu')}
if(on)cube(-.10,-.36,.8,2.3*data.gpusize,.045,.04,glow(2),'gpu',.5);pick('gpu',-.1,-.75,.88,.85)}
// PSU: sealed unit; no interior of PSU modeled
cube(.31,-2.05,.18,1.42,.66,1.30,0x283544,'psu');for(let i=0;i<5;i++)cube(.31,-2.23+i*.09,.85,1.2,.02,.03,0x7f929d,'psu');pick('psu',.3,-2.04,.64,.55);
for(let i=0;i<3;i++)cube(1.11+i*.07,-.97,.49,.038,.7,.045,0x385e70);
// Glass: correctly drawn as a transparent overlay after opaque parts
if(state.glass){gl.depthMask(false);cube(0,0,1.09,3.45,4.6,.022,0x9ed7e4,'case',.12,0,.18);gl.depthMask(true)}
}
function describe(id){state.selected=id;state.visited.add(id);$$('.part').forEach(b=>b.classList.toggle('active',b.dataset.part===id));const p=names[id];$('#partName').textContent=p[0];$('#partInfo').textContent=p[1];$('#partSafety').textContent=p[2];$('#partSku').textContent=build?.parts?.[id==='motherboard'?'board':id]?.name||'Select exact SKUs from the PC Builder.';if(state.mode==='explore')$('#progressFill').style.width=(state.visited.size/8*100)+'%'}
for(const id of order){const b=document.createElement('button');b.className='part';b.dataset.part=id;b.innerHTML='<b>'+names[id][0]+'</b><small>Inspect 3D component →</small>';b.addEventListener('click',()=>describe(id));$('#partList').appendChild(b)}
function showBuild(){const panel=$('#liveSelections');panel.replaceChildren();$('#buildTotal').textContent=build?'₱'+Number(build.priceTotal||0).toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2}):'Configure your PC first';for(const key of ['cpu','gpu','ram']){const list=build?.choices?.[key];if(!Array.isArray(list))continue;const row=document.createElement('label');row.textContent=key.toUpperCase();const sel=document.createElement('select');for(const v of list){const option=document.createElement('option');option.value=v.id;option.textContent=v.name;option.selected=v.id===build.build?.[key];sel.appendChild(option)}sel.addEventListener('change',()=>{if(window.parent!==window)window.parent.postMessage({type:'unitlab3d:choose',key,id:sel.value},location.origin);else location.href='academy.html#builder'});row.appendChild(sel);panel.appendChild(row)}describe(state.selected)}
const steps={assemble:order,disassemble:reverse};
function stepPanel(){const guided=state.mode!=='explore',path=steps[state.mode]||order,id=path[state.step];$('#advanceStep').hidden=!guided||state.step>=8;$('#restartStep').hidden=!guided;if(guided){$('#taskTitle').textContent=id?'Step '+(state.step+1)+': '+names[id][0]:'Sequence completed';$('#taskTag').textContent='VIRTUAL '+state.mode.toUpperCase();$('#taskText').textContent=id?'Identify and '+(state.mode==='assemble'?'install':'remove')+' the '+names[id][0]+' in a supervised sequence.':'Practice the physical procedure with teacher supervision.';$('#progressFill').style.width=(state.step/8*100)+'%';$('#stepCount').textContent=state.step+' / 8 completed';if(id)describe(id)}else{$('#taskTitle').textContent='Explore the system unit';$('#taskTag').textContent='EXPLORATION';$('#taskText').textContent='Orbit, zoom and select any internal part.';$('#stepCount').textContent=state.visited.size+' / 8 inspected'}}
function mode(m){state.mode=m;state.step=0;$$('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));$('#viewerStatus').textContent='◉ NATIVE 3D / '+m.toUpperCase();stepPanel()}
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>mode(b.dataset.mode)));
$('#advanceStep').addEventListener('click',()=>{state.step=Math.min(8,state.step+1);stepPanel()});
$('#restartStep').addEventListener('click',()=>mode(state.mode));
$('#rgb').addEventListener('change',e=>state.rgb=e.target.checked);$('#glass').addEventListener('change',e=>state.glass=e.target.checked);$('#power').addEventListener('change',e=>state.power=e.target.checked);$('#explode').addEventListener('input',e=>state.explode=+e.target.value/100);
$('#resetView').addEventListener('click',()=>{state.yaw=.63;state.pitch=.23;state.zoom=8.5;state.explode=0;$('#explode').value=0});
let drag=null;canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,px:e.clientX,py:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.px,dy=e.clientY-drag.py;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5)drag.moved=true;state.yaw-=dx*.008;state.pitch=Math.max(-.7,Math.min(.85,state.pitch+dy*.006));drag.px=e.clientX;drag.py=e.clientY});
canvas.addEventListener('pointerup',e=>{if(drag&&!drag.moved){const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;const hit=pickPoints.map(p=>({p,d:Math.hypot(x-p.x,y-p.y)})).sort((a,b)=>a.d-b.d)[0];if(hit&&hit.d<hit.p.r)describe(hit.p.id)}drag=null});
canvas.addEventListener('pointercancel',()=>drag=null);canvas.addEventListener('wheel',e=>{e.preventDefault();state.zoom=Math.max(5,Math.min(16,state.zoom+(e.deltaY>0?.45:-.45)))},{passive:false});
window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='unitlab3d:updatebuild'){build=e.data.snapshot;showBuild()}});
window.addEventListener('storage',e=>{if(e.key===storeKey){build=load();showBuild()}});
const part=new URLSearchParams(location.search).get('part');if(part&&names[part])state.selected=part;
describe(state.selected);showBuild();mode('explore');
function tick(t){render(t);requestAnimationFrame(tick)}requestAnimationFrame(tick);
})();