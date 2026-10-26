/* UnitLab realistic PC configurator — add-on to academy.js. Pricing snapshots and educational estimates. */
(function(){
'use strict';
const priceDate='October 23, 2026';
const DYN='https://dynaquestpc.com/pages/pc-builder', PCH='https://www.pchubonline.com/products?search=5070', EASY='https://easypc.com.ph/pages/pricelist', AMD5600='https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600x.html', AMD5700='https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-7-5700x3d.html';
const catalog=(name)=>CAT.find(c=>c.key===name);
function add(cat, records){for(const p of records)if(!catalog(cat).options.some(x=>x.id===p.id))catalog(cat).options.push(p)}
function patch(cat,id,p){const x=catalog(cat).options.find(x=>x.id===id);if(x)Object.assign(x,p)}
const sku=(o)=>({...o,verified:!!o.priceVerified,sourceDate:o.sourceDate||'Illustrative estimate · '+priceDate,url:o.url||EASY});
patch('cpu','r5600',{url:'https://bermorzone.com.ph/shop/processors/amd-processors/amd-ryzen-5-5600-6-core-3-5-ghz-socket-am4-65w-100-100000927box-desktop-processor/?attribute_variant=Processor+%26+Cooler+Only',price:6995,priceVerified:true,sourceDate:'Retailer listing · 2026'});
patch('cpu','r5600gt',{price:8495,socket:'AM4',watts:65,igpu:true,sourceDate:'Retailer example · verify'});
patch('cpu','r7600',{socket:'AM5',watts:65,igpu:true,sourceDate:'Retailer listing · 2026'});
add('cpu',[
sku({id:'r5600x',name:'AMD Ryzen 5 5600X · 6C/12T',price:8100,socket:'AM4',watts:65,igpu:false,desc:'Zen 3, 65W, AM4, DDR4. Wraith Stealth bundled on some SKUs; check boxed/tray variant.',url:'https://easypc.com.ph/pages/choose-component/processor',priceVerified:true,sourceDate:'EasyPC listed price · Oct 2026',spec:AMD5600}),
sku({id:'r5700x3d',name:'AMD Ryzen 7 5700X3D · 8C/16T',price:13995,socket:'AM4',watts:105,igpu:false,desc:'3D V-Cache gaming CPU, 105W, AM4, DDR4; retail boxed processor does not include a cooler. Price illustrative.',url:AMD5700,spec:AMD5700}),
sku({id:'r5700x',name:'AMD Ryzen 7 5700X · 8C/16T',price:9320,socket:'AM4',watts:65,igpu:false,desc:'Zen 3 8-core AM4 CPU. Tray listing, cooler may not be included.',url:DYN,priceVerified:true,sourceDate:'DynaQuest listed price · Oct 2026'}),
sku({id:'r7700',name:'AMD Ryzen 7 7700 · 8C/16T',price:12150,socket:'AM5',watts:65,igpu:true,desc:'Ryzen 7000 Zen 4 AM5/DDR5 processor.',url:DYN,priceVerified:true,sourceDate:'DynaQuest listed price · Oct 2026'})
]);
patch('board','b550',{slots:4,form:'mATX',url:'https://www.msi.com/Motherboard/B550M-PRO-VDH-WIFI/Specification',desc:'MSI B550M PRO-VDH WiFi — AM4, 4 DDR4 DIMM slots, micro ATX. Firmware support must be verified.'});
patch('board','b650',{slots:2,form:'mATX',url:'https://www.gigabyte.com/Motherboard/B650M-GAMING-WIFI-rev-10/sp',desc:'Gigabyte B650M Gaming WiFi (rev. 1.0) has 2 DDR5 slots; four RAM sticks cannot fit.'});
patch('board','b650d',{slots:4,form:'mATX',desc:'Gigabyte B650M D3HP AM5 DDR5, 4 memory slots, check exact board revision.'});
add('board',[
sku({id:'b650plus',name:'Gigabyte B650M Gaming Plus WiFi · 4 DIMMs',price:8995,socket:'AM5',ram:'DDR5',form:'mATX',slots:4,desc:'AM5 micro ATX board with FOUR DDR5 DIMM sockets. Price illustrative.',url:'https://www.gigabyte.com/ph/Motherboard/B650M-GAMING-PLUS-WIFI-rev-10-11-12/sp'}),
sku({id:'x570',name:'ASUS TUF Gaming X570-Plus WiFi',price:10495,socket:'AM4',ram:'DDR4',form:'ATX',slots:4,desc:'AM4 full ATX with four DDR4 DIMM slots. Check CPU BIOS support. Price illustrative.',url:'https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-x570-plus-wi-fi/'})
]);
for(const r of catalog('ram').options){r.dimms=2;r.capacity=(r.name.match(/(\d+)GB/)||[])[1]||16;r.desc=(r.desc||'')+' · 2 populated DIMM slots';}
add('ram',[
sku({id:'ddr4_4x8',name:'32GB DDR4-3200 · 4×8GB',price:5900,ram:'DDR4',dimms:4,capacity:32,desc:'4 identical 8GB DDR4 sticks; 4 free slots required. Price illustrative.'}),
sku({id:'ddr4_4x16',name:'64GB DDR4-3200 · 4×16GB',price:9800,ram:'DDR4',dimms:4,capacity:64,desc:'Four identical 16GB DDR4 sticks; validate QVL/timings. Price illustrative.'}),
sku({id:'ddr5_4x16',name:'64GB DDR5-5600 · 4×16GB',price:13600,ram:'DDR5',dimms:4,capacity:64,desc:'4 DDR5 modules; speed may reduce compared with 2-DIMM operation. Price illustrative.'}),
sku({id:'ddr5_2x32',name:'64GB DDR5-5600 · 2×32GB',price:14400,ram:'DDR5',dimms:2,capacity:64,desc:'2 DDR5 32GB DIMMs; often preferable to 4 DIMMs when upgrading. Price illustrative.'})
]);
patch('gpu','none',{fans:0,model:'none',recommendedPsu:0});
patch('gpu','rtx4060',{fans:2,length:245,model:'4060',recommendedPsu:550,price:19950});
patch('gpu','rx7600',{fans:2,length:245,model:'rx7600',recommendedPsu:550});
patch('gpu','rtx5060',{fans:2,length:260,model:'5060',recommendedPsu:550});
add('gpu',[
sku({id:'4060msi',name:'MSI GeForce RTX 4060 Ventus 2X OC · 8GB',price:21250,watts:115,length:199,fans:2,model:'4060',recommendedPsu:550,desc:'MSI Ventus 2X style; two axial fans. Nominal length for training; verify actual exact SKU.',url:'https://www.msi.com/Graphics-Card/GeForce-RTX-4060-VENTUS-2X-BLACK-8G-OC/Specification'}),
sku({id:'5070msi',name:'MSI GeForce RTX 5070 Ventus 2X OC · 12GB',price:46995,watts:250,length:236,fans:2,model:'5070',recommendedPsu:650,desc:'MSI exact model: 236×126×50mm, 250W, 16-pin power, recommended 650W PSU. Price sourced from dated PCHub listing.',url:'https://www.pchubonline.com/product/5140852/MSI%20RTX%205070%20Ventus%202X%20OC',spec:'https://www.msi.com/Graphics-Card/GeForce-RTX-5070-12G-VENTUS-2X-OC/Specification',priceVerified:true,sourceDate:'PCHub listing · Sep 11, 2026'}),
sku({id:'5070zotac',name:'ZOTAC RTX 5070 Twin Edge · 12GB',price:44995,watts:250,length:242,fans:2,model:'5070',recommendedPsu:650,desc:'Two-fan 5070-class example. Verify exact dimensions and connector type for the specific card revision.',url:PCH,priceVerified:true,sourceDate:'PCHub listing · Sep 11, 2026'}),
sku({id:'5070asus',name:'ASUS Prime RTX 5070 OC · 12GB',price:51995,watts:250,length:304,fans:3,model:'5070',recommendedPsu:650,desc:'Three-fan ASUS Prime OC variant; verify dimensions from exact board SKU.',url:PCH,priceVerified:true,sourceDate:'PCHub listing · Sep 11, 2026'}),
sku({id:'4060galax',name:'GALAX RTX 4060 1-Click OC 1X · 8GB',price:18240,watts:115,length:165,fans:1,model:'4060',recommendedPsu:550,desc:'Single-fan GALAX RTX 4060, retailer listing showed out of stock.',url:'https://easypc.com.ph/products/galax-geforce-rtx-4060-1-click-oc-1x-8gb-gddr6-128-bit-videocard',priceVerified:true,sourceDate:'EasyPC listing · Oct 2026 / out of stock'})
]);
patch('psu','cx650',{capacity:650,power16pin:false,desc:'Corsair CX650; check exact connectors. An RTX 5070 may need a certified 16-pin cable or correct adapter supplied with the card.'});
patch('psu','psu550',{capacity:550,power16pin:false});
patch('psu','psu750',{capacity:750,power16pin:true});
add('psu',[sku({id:'rm850',name:'Corsair RM850e ATX 3.1 850W (illustrative)',price:8495,capacity:850,power16pin:true,desc:'Modern 850W model with native PCIe 16-pin support on applicable revision. Verify model package.'})]);
patch('case','mcase',{forms:['mATX','mini-ITX'],gpuMax:270});
patch('case','atxcase',{forms:['ATX','mATX','mini-ITX'],gpuMax:340});
patch('case','smallcase',{forms:['mATX','mini-ITX'],gpuMax:220});
patch('cooler','stock',{tdp:75,sockets:['AM4','AM5']});
patch('cooler','tower',{tdp:160,sockets:['AM4','AM5']});
add('cooler',[sku({id:'aio240',name:'240mm ARGB AIO Liquid Cooler (sample)',price:4495,sockets:['AM4','AM5'],tdp:200,desc:'Dual-fan 240mm liquid cooler; check radiator support and mounting kit.'})]);
const PRESETS=[
{name:'5600X + RTX 4060',desc:'Budget 1080p gaming',build:{cpu:'r5600x',board:'b550',ram:'ddr4_16',gpu:'4060msi',storage:'sn580_1t',psu:'cx650',case:'mcase',cooler:'tower'}},
{name:'5700X3D + RTX 5070',desc:'High-performance AM4 gaming',build:{cpu:'r5700x3d',board:'b550',ram:'ddr4_32',gpu:'5070msi',storage:'sn580_1t',psu:'psu750',case:'atxcase',cooler:'tower'}},
{name:'5700X3D + 4×8GB',desc:'Four-stick DDR4 practice',build:{cpu:'r5700x3d',board:'x570',ram:'ddr4_4x8',gpu:'5070asus',storage:'sn580_1t',psu:'rm850',case:'atxcase',cooler:'tower'}},
{name:'AM5 + 4×16GB DDR5',desc:'Four-DIMM AM5 demonstration',build:{cpu:'r7700',board:'b650plus',ram:'ddr5_4x16',gpu:'5070zotac',storage:'sn580_1t',psu:'rm850',case:'atxcase',cooler:'aio240'}}
];
const STORE_KEY='unitlab3d_livebuild_v4';
const safe=p=>String(p).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const formatter=n=>'₱'+Number(n).toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2});
const get=(k)=>catalog(k).options.find(p=>p.id===build[k])||catalog(k).options[0];
function sync(){
const snapshot={build:{...build},parts:Object.fromEntries(CAT.map(c=>[c.key,{...get(c.key)}])),choices:Object.fromEntries(['cpu','gpu','ram'].map(key=>[key,catalog(key).options.map(p=>({id:p.id,name:p.name,price:p.price,dimms:p.dimms||2,fans:p.fans||0,length:p.length||0}))])),priceTotal:total(),time:Date.now(),version:4};
localStorage.setItem(STORE_KEY,JSON.stringify(snapshot));
const frame=document.getElementById('labFrame');if(frame?.contentWindow)frame.contentWindow.postMessage({type:'unitlab3d:updatebuild',snapshot},location.origin);
}
function setPreset(i){const p=PRESETS[i];if(!p)return;build={...p.build};sync();renderBuilder()}
/* Explain every detected mismatch with the actual selected products.
   Suggestions are explicit learner choices, never automatic silent substitutions. */
const cheapest=(key,predicate)=>catalog(key).options.filter(predicate).sort((a,b)=>a.price-b.price)[0]||null;
const action=(key,item)=>item?{key,id:item.id,label:"Choose "+item.name,price:item.price}:null;
const checks=()=>{
 const cpu=get('cpu'),mb=get('board'),ram=get('ram'),gpu=get('gpu'),psu=get('psu'),pcase=get('case'),cooler=get('cooler');
 const rows=[];
 const add=(kind,id,title,why,fix,actions=[],details="")=>rows.push({
  kind,id,title,why,fix,actions:actions.filter(Boolean),details,
  message:title+": "+why
 });
 const boardForCPU=cheapest('board',o=>o.socket===cpu.socket&&o.ram===ram.ram&&(o.slots||2)>=(ram.dimms||2));
 const boardOnly=cheapest('board',o=>o.socket===cpu.socket);
 const cpuForBoard=cheapest('cpu',o=>o.socket===mb.socket);
 const ramForBoard=cheapest('ram',o=>o.ram===mb.ram&&(o.dimms||2)<=(mb.slots||2));
 const boardForRam=cheapest('board',o=>o.ram===ram.ram&&o.socket===cpu.socket&&(o.slots||2)>=(ram.dimms||2));
 if(cpu.socket!==mb.socket){
  add('fail','socket','CPU and motherboard sockets do not match',
   cpu.name+" uses "+cpu.socket+", but "+mb.name+" uses "+mb.socket+". The CPU cannot be installed in this board.",
   "Keep your CPU and choose a "+cpu.socket+" motherboard, or keep this motherboard and choose a "+mb.socket+" CPU.",
   [action('board',boardForCPU||boardOnly),action('cpu',cpuForBoard)]);
 }else add('pass','socket','CPU socket fits motherboard',cpu.socket+" matches "+mb.socket+".","Still verify exact CPU support and firmware revision.");
 if(ram.ram!==mb.ram){
  add('fail','memory','Incorrect RAM generation',
   ram.name+" is "+ram.ram+", while "+mb.name+" requires "+mb.ram+". DDR4 and DDR5 are physically incompatible.",
   "Choose a "+mb.ram+" memory kit, or change to a compatible "+ram.ram+" motherboard.",
   [action('ram',ramForBoard),action('board',boardForRam)]);
 }else add('pass','memory','RAM type matches motherboard',ram.ram+" DIMMs match the board's memory standard.","Verify the memory QVL for rated speed.");
 const dimms=ram.dimms||2,slots=mb.slots||2;
 if(dimms>slots){
  const lessSticks=cheapest('ram',o=>o.ram===mb.ram&&(o.dimms||2)<=slots);
  const moreSlots=cheapest('board',o=>o.socket===cpu.socket&&o.ram===ram.ram&&(o.slots||2)>=dimms);
  add('fail','dimms','Not enough memory slots',
   "Your selected kit uses "+dimms+" DIMMs, but "+mb.name+" has only "+slots+" physical DIMM slots.",
   "Choose a kit with "+slots+" or fewer sticks, or a supported board with at least "+dimms+" slots.",
   [action('ram',lessSticks),action('board',moreSlots)]);
 }else add('pass','dimms','RAM stick count fits',dimms+" selected sticks fit in "+slots+" physical motherboard slots.","Install in the board maker's recommended positions.");
 if(dimms===4)add('warn','four-dimms','Four-stick memory configuration',
  "Four DIMMs can require a lower supported RAM clock and make memory training more demanding.",
  "Check the exact motherboard QVL and BIOS. Two suitably sized DIMMs may be simpler.",
  [action('ram',cheapest('ram',o=>o.ram===mb.ram&&(o.dimms||2)===2&&(Number(o.capacity)||0)>=(Number(ram.capacity)||0)))]);
 if(gpu.id==='none'&&!cpu.igpu){
  const replacementGpu=cheapest('gpu',o=>o.id!=='none'&&(o.length||0)<=pcase.gpuMax&&(o.recommendedPsu||0)<=psu.capacity);
  const replacementCpu=cheapest('cpu',o=>o.socket===mb.socket&&o.igpu);
  add('fail','graphics','No usable graphics output',
    cpu.name+" does not have integrated graphics, and no discrete GPU is selected.",
    "Add a compatible graphics card or choose a processor with integrated graphics.",
    [action('gpu',replacementGpu),action('cpu',replacementCpu)]);
 }else add('pass','graphics','Display hardware available',gpu.id==='none'?"CPU provides integrated graphics.":"A dedicated graphics card is selected.","Confirm your monitor can connect to an active display output.");
 if(gpu.id!=='none'){
  const length=gpu.length||0,clearance=pcase.gpuMax||0;
  if(length>clearance){
    const wider=cheapest('case',o=>o.forms.includes(mb.form)&&(o.gpuMax||0)>=length);
    const shorter=cheapest('gpu',o=>o.id!=='none'&&(o.length||0)<=clearance);
    add('fail','gpu-clearance','Graphics card will not fit the case',
      "The chosen "+gpu.name+" is approximately "+length+" mm long; "+pcase.name+" only allows "+clearance+" mm in this learning catalog.",
      "Choose a case with "+length+" mm or more GPU clearance, or use a shorter card.",
      [action('case',wider),action('gpu',shorter)]);
  }else add('pass','gpu-clearance','GPU length fits example case',length+" mm graphics card vs "+clearance+" mm listed case clearance.","Check the exact model's radiator/fan clearance as well.");
  const rec=gpu.recommendedPsu||500;
  if(psu.capacity<rec){
    const better=cheapest('psu',o=>o.capacity>=rec&&o.capacity>=cpu.watts+(gpu.watts||0)+100);
    add('fail','psu-rated','PSU below graphics card recommendation',
      gpu.name+" recommends approximately "+rec+" W system power, but "+psu.name+" provides "+psu.capacity+" W.",
      "Choose a power supply rated at least "+rec+" W with the required GPU connectors.",
      [action('psu',better)]);
  }else add('pass','psu-rated','Meets GPU wattage guideline',psu.capacity+" W PSU meets the GPU's "+rec+" W reference.","Check actual PSU model and cable count.");
  if(gpu.model==='5070'&&!psu.power16pin){
    add('warn','gpu-cable','GPU power connector must be confirmed',
      "The selected RTX 5070-class card may use a 16-pin connector, but this PSU listing does not confirm a native 16-pin lead.",
      "Verify exact board/PSU cable specifications and use only a manufacturer-approved adapter.",
      [action('psu',cheapest('psu',o=>o.power16pin&&o.capacity>=rec))]);
  }
 }
 if(!pcase.forms.includes(mb.form)){
   add('fail','case','Motherboard form factor does not fit',
     mb.name+" is "+mb.form+", but "+pcase.name+" supports "+pcase.forms.join(", ")+".",
     "Choose a case that explicitly supports "+mb.form+".",
     [action('case',cheapest('case',o=>o.forms.includes(mb.form)&&(o.gpuMax||0)>=(gpu.length||0)))]);
 }else add('pass','case','Board size fits case',mb.form+" is supported by the selected case.","Verify standoff locations.");
 if(!(cooler.sockets||[]).includes(cpu.socket)){
  add('fail','cooler','CPU cooler mounting is incompatible',
   cooler.name+" does not list "+cpu.socket+" mounting, required by "+cpu.name+".",
   "Choose a cooler with a compatible "+cpu.socket+" kit.",
   [action('cooler',cheapest('cooler',o=>(o.sockets||[]).includes(cpu.socket)))]);
 }else add('pass','cooler','Cooler supports CPU socket',cooler.name+" lists "+cpu.socket+" mounting.","Confirm case height and package accessories.");
 if(cooler.tdp&&cooler.tdp<cpu.watts){
  add('fail','thermal','Cooler capacity may be insufficient',
   "Processor power estimate is "+cpu.watts+" W, but the cooler's approximate rating is "+cooler.tdp+" W.",
   "Choose a cooler with a higher thermal rating.",
   [action('cooler',cheapest('cooler',o=>(o.sockets||[]).includes(cpu.socket)&&(!o.tdp||o.tdp>=cpu.watts)))]);
 }
 const basicLoad=cpu.watts+(gpu.watts||0)+100;
 if(psu.capacity<basicLoad){
  add('fail','power','Estimated PC load exceeds PSU wattage',
    "Approximate CPU+GPU+other system demand is "+basicLoad+" W vs a "+psu.capacity+" W PSU.",
    "Choose a higher quality PSU with adequate headroom and correct cables.",
    [action('psu',cheapest('psu',o=>o.capacity>=Math.max(basicLoad, gpu.recommendedPsu||0)))]);
 }
 if(cpu.id==='r5700x3d')add('warn','firmware','Check Ryzen 7 5700X3D BIOS support',
  "AM4 socket match does not guarantee firmware support; this CPU also needs adequate cooling.",
  "Check your exact motherboard revision and CPU support list before purchase.");
 add('warn','verify','Confirm the exact SKU before purchasing',
  "Sample prices, BIOS revisions, connector variants and case clearances may differ from your actual hardware.",
  "Compare the exact manufacturer's CPU support list, QVL, PSU cable specifications and case dimensions.");
 return rows;
};
function total(){return CAT.reduce((n,c)=>n+get(c.key).price,0)}
function renderBuilderPro(){
const container=$('#builderFields');if(!container)return;
const optionsCount=CAT.reduce((n,c)=>n+c.options.length,0);
const homeCount=$('#catalogCount');if(homeCount)homeCount.textContent=optionsCount;
let html='<div class="builder-field" style="background:#133744;border-radius:13px;padding:16px"><div class="field-head"><label>Choose a full PC preset</label><small>Change any component afterward</small></div><div style="display:flex;gap:8px;flex-wrap:wrap">'+PRESETS.map((p,i)=>'<button type="button" class="btn outline small" data-buildpreset="'+i+'" title="'+safe(p.desc)+'">'+safe(p.name)+'</button>').join('')+'</div></div>';
for(const c of CAT){const p=get(c.key);const verified=p.priceVerified||p.verified; const source=p.sourceDate||'Estimate · '+priceDate;const sourceLink=p.url||EASY;
html+='<div class="builder-field"><div class="field-head"><label for="choose-'+c.key+'">'+safe(c.title)+'</label><small>'+formatter(p.price)+'</small></div><select id="choose-'+c.key+'" data-cat="'+c.key+'">'+c.options.map(o=>'<option value="'+safe(o.id)+'" '+(o.id===build[c.key]?'selected':'')+'>'+safe(o.name)+' — '+formatter(o.price)+'</option>').join('')+'</select><div class="spec-line">'+safe(p.desc||'')+'</div><div class="price-source"><span>'+(verified?'Retailer price snapshot':'Illustrative price estimate')+' · '+safe(source)+'</span><a href="'+safe(sourceLink)+'" target="_blank" rel="noopener">Product / source ↗</a></div></div>';
}
container.innerHTML=html;
container.querySelectorAll('[data-cat]').forEach(el=>el.addEventListener('change',e=>{build[e.target.dataset.cat]=e.target.value;window.unitlabFocus=e.target.dataset.cat;sync();renderBuilder()}));
container.querySelectorAll('[data-buildpreset]').forEach(el=>el.addEventListener('click',()=>setPreset(+el.dataset.buildpreset)));
const t=total();$('#totalCost').textContent=formatter(t);
const list=checks(),issues=list.filter(r=>r.kind==='fail'),warnings=list.filter(r=>r.kind==='warn'),passing=list.filter(r=>r.kind==='pass');
const fails=issues.length,warns=warnings.length;
const status=$('#buildRating');
status.textContent=fails?fails+' ISSUE'+(fails===1?'':'S')+' · FIX BELOW':'BASIC COMPATIBILITY PASSES';
status.classList.toggle('has-errors',fails>0);
status.style.background=fails?'#873e48':'#22684f';
const fixButtons=r=>(r.actions||[]).map((a,i)=>'<button type="button" class="compat-fix" data-fix-key="'+safe(a.key)+'" data-fix-id="'+safe(a.id)+'" title="Change '+safe(a.key)+' to '+safe(a.label)+'">'+(i===0?'Recommended: ':'Alternative: ')+safe(a.label)+' · '+formatter(a.price)+' →</button>').join('');
const issueCard=r=>'<article class="compat-card compat-'+safe(r.kind)+'"><div class="compat-card-header"><span class="compat-icon" aria-hidden="true">✕</span><h4>'+safe(r.title)+'</h4></div><p><b>What is wrong:</b> '+safe(r.why)+'</p><p><b>How to fix:</b> '+safe(r.fix)+'</p><div class="compat-fixes">'+fixButtons(r)+'</div></article>';
const warningCard=r=>'<div class="compat-note"><strong>Review: '+safe(r.title)+'</strong><p>'+safe(r.why)+' '+safe(r.fix)+'</p>'+fixButtons(r)+'</div>';
$('#compatibilityPanel').innerHTML=
 '<div class="compat-head"><div><span class="compat-eyebrow">LIVE HARDWARE VALIDATION</span><h3>Build compatibility</h3><p>'+ (fails?'Resolve the '+fails+' issue'+(fails===1?'':'s')+' below before assembling.':'Core compatibility checks pass. Review the notes before purchase or assembly.')+'</p></div><span class="compat-count '+(fails?'is-bad':'is-good')+'">'+fails+' issues</span></div>'+
 '<div class="compat-summary"><span>'+passing.length+' passing checks</span><span>'+warns+' review notes</span><span>Approx. load: '+(get('cpu').watts+(get('gpu').watts||0)+100)+' W</span></div>'+
 (fails?'<div class="compat-issues">'+issues.map(issueCard).join('')+'</div>':'<div class="compat-success">✓ No detected hard mismatches in this educational catalog.</div>')+
 '<details class="compat-review"><summary>Important checks & limitations ('+warns+')</summary>'+warnings.map(warningCard).join('')+'</details>'+
 '<details class="compat-passing"><summary>Show '+passing.length+' passing checks</summary><ul>'+passing.map(r=>'<li><strong>'+safe(r.title)+'</strong> — '+safe(r.why)+'</li>').join('')+'</ul></details>'+
 '<p class="compat-disclaimer">Educational estimates, not a guarantee. Real-world BIOS, exact component dimensions, cables and current seller stock must be independently confirmed.</p>';
$('#compatibilityPanel').querySelectorAll('[data-fix-key]').forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.fixKey,id=button.dataset.fixId;
  if(!catalog(key)?.options.some(o=>o.id===id))return;
  build[key]=id;window.unitlabFocus=key;sync();renderBuilder();
  $('#compatibilityPanel')?.scrollIntoView({behavior:'smooth',block:'nearest'});
}));
const focus=CAT.find(c=>c.key===(window.unitlabFocus||'gpu'))||CAT[0],p=get(focus.key);
$('#selectedDetail').innerHTML='<div class="eyebrow">CONFIGURED HARDWARE • '+safe(focus.title)+'</div><h3>'+safe(p.name)+'</h3><p>'+safe(p.desc||'')+'</p><p><b>Unit price:</b> '+formatter(p.price)+'<br><b>Price basis:</b> '+safe(p.sourceDate||'Illustrative estimate')+'</p><p><a href="'+safe(p.spec||p.url||EASY)+'" target="_blank" rel="noopener">Specifications / official or retailer reference ↗</a></p><p><b>Installed memory:</b> '+safe(get('ram').name)+' / '+(get('ram').dimms||2)+' DIMM modules.</p>';
const summary=document.querySelector('.builder-actions');
let extra=document.getElementById('unitlabNewActions');
if(!extra){extra=document.createElement('div');extra.id='unitlabNewActions';extra.style.cssText='width:100%;display:grid;gap:10px;padding:12px 0';summary.appendChild(extra)}
extra.innerHTML='<div style="border:1px solid #366572;background:#102f3c;border-radius:12px;padding:14px"><strong style="display:block;font-size:21px;color:#d9fff5">FINAL PARTS TOTAL: '+formatter(t)+'</strong><small>All eight selected categories included. Estimated component-only total in PHP; shipping, assembly, tax adjustments and stock not guaranteed.</small></div><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn outline small" id="viewLivePc">View selected parts in 3D ↗</button><button class="btn outline small" id="downloadQuote">Download itemized price quotation CSV</button></div>';
$('#viewLivePc').addEventListener('click',()=>{sync();navigate('workbench')});
$('#downloadQuote').addEventListener('click',()=>{const lines=[['UnitLab PC Build · '+priceDate],['Category','Product','Price PHP','Basis','Source URL'],...CAT.map(c=>{const x=get(c.key);return [c.title,x.name,x.price,x.sourceDate||'illustrative',x.url||EASY]}),['TOTAL','',t,'Excludes shipping / extra service','']];const csv=lines.map(a=>a.map(s=>'"'+String(s??'').replaceAll('"','""')+'"').join(',')).join('\r\n');const a=document.createElement('a'),url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));a.href=url;a.download='UnitLab3D_Build_PHP_'+new Date().toISOString().slice(0,10)+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)});
sync();renderPC();renderPreviewModel(p);
}
function renderPreviewModel(p){
 const root=$('#pcVisualizer');
 if(!root)return;
 /* Use a licensed, actual GLB computer mesh rather than a CSS block drawing.
    Mesh is a generic hardware learning example, NOT the selected product SKU. */
 const m='https://raw.githubusercontent.com/brickshow/pc-anatomy/main/public/models/system_unit_update.glb';
 const fallback='https://raw.githubusercontent.com/brickshow/pc-anatomy/main/public/models/system_unit.glb';
 const cpu=get('cpu'),gpu=get('gpu'),ram=get('ram');
 root.replaceChildren();
 const viewer=document.createElement('model-viewer');
 viewer.setAttribute('src',m);
 viewer.setAttribute('camera-controls','');
 viewer.setAttribute('auto-rotate','');
 viewer.setAttribute('rotation-per-second','10deg');
 viewer.setAttribute('interaction-prompt','none');
 viewer.setAttribute('environment-image','neutral');
 viewer.setAttribute('shadow-intensity','1');
 viewer.setAttribute('exposure','1.08');
 viewer.setAttribute('loading','lazy');
 viewer.setAttribute('alt','Interactive generic PC chassis 3D model. This is a reference computer, not the exact selected CPU, GPU, memory or case.');
 viewer.className='real-build-model';
 let triedBackup=false;
 viewer.addEventListener('error',()=>{
  if(!triedBackup){triedBackup=true;viewer.src=fallback;return;}
  root.querySelector('.build-loading')?.replaceChildren(document.createTextNode('3D reference unavailable. Your parts and compatibility checks still work.'));
 });
 viewer.addEventListener('load',()=>{
  const status=root.querySelector('.build-loading');if(status)status.hidden=true;
 });
 const loading=document.createElement('div');
 loading.className='build-loading';
 loading.textContent='Loading licensed real 3D case reference…';
 const overlay=document.createElement('div');
 overlay.className='build-overlay';
 overlay.textContent=cpu.name+' • '+gpu.name+' • '+(ram.dimms||2)+' RAM sticks';
 root.append(viewer,loading,overlay);
}
renderBuilder=renderBuilderPro;
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.data?.type!=='unitlab3d:choose')return;const {key,id}=event.data;if(!['cpu','gpu','ram'].includes(key)||!catalog(key).options.some(p=>p.id===id))return;build[key]=id;window.unitlabFocus=key;sync();renderBuilder()});
window.UnitLabCatalog={CAT,PRESETS,priceDate,STORE_KEY,totals:total,checks};
})();