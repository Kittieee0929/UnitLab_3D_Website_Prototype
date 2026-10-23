/* UnitLab local account DEMO. GitHub Pages cannot offer secure server-side authentication.
   Never store personal identifiers, real research records or institutional passwords here. */
(()=>{'use strict';
const ACCOUNTS_KEY='unitlab3d_local_demo_accounts_v1';
const AUTH_KEY='unitlab3d_local_auth';
let mode='login';
const $=s=>document.querySelector(s);
function accounts(){try{return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)||'{}')}catch{return {}}}
function saveAccounts(obj){localStorage.setItem(ACCOUNTS_KEY,JSON.stringify(obj))}
function hex(bytes){return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('')}
function unhex(str){return new Uint8Array((str.match(/../g)||[]).map(x=>parseInt(x,16)))}
async function derive(password,salt){
const imported=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),{name:'PBKDF2'},false,['deriveBits']);
const hash=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:180000,hash:'SHA-256'},imported,256);
return hex(new Uint8Array(hash));
}
function feedback(msg,bad=false){const el=$('#accountFeedback');el.textContent=msg;el.style.color=bad?'#ffc5bc':'#9bebd0'}
function switchMode(next){mode=next;const create=mode==='register';$('#accountTitle').textContent=create?'Create a demo student account':'Student sign in';$('#accountSubmit').textContent=create?'Create account →':'Log in →';$('#accountSwitch').textContent=create?'Already have an account? Log in':'Create an account instead';$('#confirmLabel').hidden=!create;$('#confirmPassword').hidden=!create;$('#confirmPassword').required=create;$('#loginPassword').setAttribute('autocomplete',create?'new-password':'current-password');feedback('')}
function signIn(code){state.student=code;sessionStorage.setItem('unitlab3d_student_demo',code);sessionStorage.setItem(AUTH_KEY,code);authUI();renderModules();renderQuiz();closeLogin();$('#loginPassword').value='';$('#confirmPassword').value='';toast('Local demo account active: '+code)}
async function submitAuth(ev){
ev.preventDefault();ev.stopImmediatePropagation(); // Stops old code-only auth handler.
const code=$('#loginCode').value.trim().toUpperCase(),pass=$('#loginPassword').value;
if(!/^[A-Z0-9_-]{3,24}$/.test(code)){feedback('Enter a 3–24 character learner code with letters, digits, - or _.',true);return}
if(pass.length<8){feedback('Use at least 8 characters for the demonstration password.',true);return}
if(!crypto?.subtle){feedback('Password handling requires HTTPS or localhost. Open the GitHub Pages website.',true);return}
const btn=$('#accountSubmit');btn.disabled=true;
try{
const all=accounts(),current=all[code];
if(mode==='register'){
if(current){feedback('This learner code already exists on this device. Use Log in.',true);return}
if(pass!==$('#confirmPassword').value){feedback('The passwords do not match.',true);return}
const salt=crypto.getRandomValues(new Uint8Array(16));
all[code]={salt:hex(salt),hash:await derive(pass,salt),createdAt:new Date().toISOString(),version:1};saveAccounts(all);signIn(code);
}else{
if(!current){feedback('No account with that code on this device. Choose Create account.',true);return}
const checked=await derive(pass,unhex(current.salt));
if(checked!==current.hash){feedback('That password does not match this local demo account.',true);return}
signIn(code);
}
}catch(e){feedback('Unable to open the local account: '+e.message,true)}
finally{btn.disabled=false}
}
function init(){
const form=$('#loginForm');if(!form)return;
form.addEventListener('submit',submitAuth,true);
$('#accountSwitch').addEventListener('click',()=>switchMode(mode==='login'?'register':'login'));
switchMode('login');
const existing=state.student;
if(existing&&(sessionStorage.getItem(AUTH_KEY)!==existing||!accounts()[existing])){
state.student='';sessionStorage.removeItem('unitlab3d_student_demo');sessionStorage.removeItem(AUTH_KEY);authUI();
}
window.addEventListener('storage',e=>{if(e.key===ACCOUNTS_KEY&&state.student&&!accounts()[state.student]){state.student='';sessionStorage.removeItem(AUTH_KEY);sessionStorage.removeItem('unitlab3d_student_demo');authUI()}});
}
document.addEventListener('DOMContentLoaded',init);
})();