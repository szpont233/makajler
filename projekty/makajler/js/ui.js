import { state, shopDefinitions, achDefs, levels, priceFor, computeCPS, computeClickValue, save, load } from './state.js';
import { toggleMute, isMuted } from './audio.js';


const scoreEl = document.getElementById('score');
const cpsEl = document.getElementById('cps');
const clickValueEl = document.getElementById('clickValue');
const shopEl = document.getElementById('shop');
const achievementsEl = document.getElementById('achievements');
const levelEl = document.getElementById('level');
const img = document.getElementById('img');


export function recalcCPSUI() {
const v = computeCPS();
if (cpsEl) cpsEl.textContent = v.toFixed(2);
}


export function recalcClickValueUI() {
const v = computeClickValue();
if (clickValueEl) clickValueEl.textContent = v.toFixed(2);
return v;
}


export function renderShop(){
if(!shopEl) return;
shopEl.innerHTML = '';
shopDefinitions.forEach(def=>{
const item = state.items[def.id] || {quantity:0};
def.quantity = item.quantity || 0;
const wrapper = document.createElement('div');
wrapper.className = 'shop-item';
wrapper.innerHTML = `<div><strong>${def.name}</strong><small>${def.desc}</small><div style="font-size:12px;color:#666">Posiadasz: ${def.quantity}</div></div><div style="text-align:right"><div style="font-weight:bold">${priceFor(def)} €</div><button data-id="${def.id}">Kup</button></div>`;
shopEl.appendChild(wrapper);
wrapper.querySelector('button').addEventListener('click',()=>{
const ev = new CustomEvent('szpont:buy',{detail:{defId:def.id}});
window.dispatchEvent(ev);
});
});
}


export function renderAchievements(){
if(!achievementsEl) return;
achievementsEl.innerHTML = '';
achDefs.forEach(a=>{
const unlocked = a.check(state);
const el = document.createElement('div');
el.textContent = a.label + (unlocked ? ' OK' : '');
achievementsEl.appendChild(el);
});
}


export function renderLevel(){
if(!levelEl) return;
const lvl = levels.slice().reverse().find(l => state.score >= l.req) || levels[0];
const lvlIndex = levels.indexOf(lvl) + 1;
levelEl.textContent = `Poziom ${lvlIndex} – ${lvl.name}`;
}


export function render(){
if(scoreEl) scoreEl.textContent = Math.floor(state.score);
renderLevel();
renderAchievements();
}


export function initUI(){
const resetBtn = document.getElementById('reset');
const saveBtn = document.getElementById('save');
const dzwBtn = document.getElementById('dzwieki');
if(resetBtn) resetBtn.addEventListener('click', ()=>{
if (!confirm('Chcesz cofnąć sie do epoki kamienia łupanego?')) return;
localStorage.removeItem('szpont-state');
location.reload();
});
if(saveBtn) saveBtn.addEventListener('click', ()=>{ save(); });
if(dzwBtn) dzwBtn.addEventListener('click', ()=>{
const muted = toggleMute();
dzwBtn.textContent = muted ? 'Włącz dźwięki' : 'Wyłącz dźwięki';
});
}