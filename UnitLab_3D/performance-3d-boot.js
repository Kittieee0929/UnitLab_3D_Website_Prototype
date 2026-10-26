/* UnitLab 3D — resilient engine initialization.
   The lesson and lab are static GitHub Pages assets. Browser networks may
   block one CDN, so try a second independent ES-module provider. */
const status=document.getElementById('stageStatus');
const hosts=[
 {name:'jsDelivr',core:'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js',
  orbit:'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js',
  gltf:'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js',
  wait:9500},
 {name:'ESM.sh',core:'https://esm.sh/three@0.160.1?target=es2020',
  orbit:'https://esm.sh/three@0.160.1/examples/jsm/controls/OrbitControls.js?target=es2020',
  gltf:'https://esm.sh/three@0.160.1/examples/jsm/loaders/GLTFLoader.js?target=es2020',
  wait:12500}
];
function progress(message){
 if(!status||status.hidden)return;
 const para=status.querySelector('p');
 if(para)para.textContent=message;
}
function errorPanel(message){
 if(!status)return;
 status.hidden=false;
 const h=document.createElement('strong');h.textContent='3D Lab could not initialize';
 const p=document.createElement('p');p.textContent=message;
 const l=document.createElement('a');l.href='worklab-pro.html?embedded=1';
 l.className='btn primary';l.textContent='Open backup workbench';
 status.replaceChildren(h,p,l);
 window.dispatchEvent(new CustomEvent('unitlab3d:engine-unavailable',{detail:{message}}));
}
const withTimeout=(promise,ms)=>new Promise((resolve,reject)=>{
 const id=setTimeout(()=>reject(new Error('Download timed out after '+Math.round(ms/1000)+' seconds')),ms);
 Promise.resolve(promise).then(v=>{clearTimeout(id);resolve(v)},e=>{clearTimeout(id);reject(e)});
});
async function start(){
 let lab;
 try{lab=await import('./performance-3d.js?rev=fix20261026')}catch(e){
   errorPanel('The local assembly script could not load: '+String(e.message||e));
   return;
 }
 for(let i=0;i<hosts.length;i++){
   const host=hosts[i];
   progress('Loading the 3D graphics engine ('+host.name+')… '+(i===0?'A second source is available if this one fails.':'Retrying another provider.'));
   let deps;
   try{
     deps=await withTimeout(Promise.all([
       import(/* @vite-ignore */host.core),
       import(/* @vite-ignore */host.orbit),
       import(/* @vite-ignore */host.gltf)
     ]),host.wait);
   }catch(e){
     console.warn('UnitLab 3D: engine provider failed',host.name,e);
     continue;
   }
   try{
     if(typeof deps[1].OrbitControls!=='function'||typeof deps[2].GLTFLoader!=='function')throw new Error('Unexpected engine module exports');
     lab.startUnitLab(deps[0],deps[1].OrbitControls,deps[2].GLTFLoader);
     return;
   }catch(e){
     console.error('UnitLab 3D: unable to create the WebGL scene',e);
     errorPanel('The 3D engine loaded, but the assembly scene could not start: '+String(e.message||e));
     return;
   }
 }
 errorPanel('Neither graphics library source was reachable. A school firewall, restricted CDN access, or browser setting may be blocking it. Please open the backup workbench or try another network.');
}
start().catch(e=>errorPanel('Unexpected startup error: '+String(e.message||e)));
