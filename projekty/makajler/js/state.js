export const state = {
  score: 0,
  baseClick: 1,
  clickMultiplier: 1,
  cps: 0,
  items: {},
  lastTick: Date.now()
};

export const images = ['assets/img/baza0.png','assets/img/baza1.png','assets/img/baza2.png'];
export const shopDefinitions = [
  {id:'popit', name:'Sąsiad', cost:15, cps:0.1, click:0, quantity:0, desc:'+0.1 CPS'},
  {id:'konsola', name:'Argentyńskie bydło', cost:100, cps:1, click:0, quantity:0, desc:'+1 CPS'},
  {id:'kawa', name:'Kawa + fajka na śniadanie', cost:250, cps:0, click:1, quantity:0, desc:'+1 do kliknięcia'},
  {id:'guru', name:'Plebsowy GPT 6-7', cost:1200, cps:10, click:0, quantity:0, desc:'+10 CPS'},
  {id:'boost', name:'Kwantowy GPT-7.6', cost:5000, cps:0, click:10, quantity:0, desc:'+10 do kliknięcia'},
  {id:'ojczysta', name:'Ojczysta 100%', cost:10000, cps:0, click:20, quantity:0, desc:'+20 do kliknięcia'}
];

export const achDefs = [
  {id:'10', label:'10 klikesow', check:st=>Math.floor(st.score)>=10},
  {id:'100', label:'100 pkt', check:st=>Math.floor(st.score)>=100},
  {id:'firstbuy', label:'Pierwszy zakup', check:st=>Object.keys(st.items).length>0},
  { id: '10m', label: '10 milionów kliknięć?!', check: st => st.score >= 10_000_000 },
  { id: '40m', label: 'Legenda Szpontoklikera', check: st => st.score >= 40_000_000 },
];

export const levels = [
  {req:0, name:"Zbieracz kiepów"},
  {req:500, name:"Bezrobotny renciarz"},
  {req:1000, name:"Robotnik z socjalem"},
  {req:5000, name:"Kierorwnik zegarka OREGON SCIENTIFIC"},
  {req:10000, name:"Menadżer pilotu od telewizora"},
  {req:15000, name:"Dyrektor PKS Dzialdowo S.A"},
  {req:25000, name:"Prezes Szpont Holding z Cypru"},
  {req:50000, name:"Szpont Obajtek"},
  {req:100000, name:"Przemytnik dzialek na Ksiezycu"},
  {req:250000, name:"Użytkownik kierownicy Espranaza"},
  {req:500000, name: "Oficjalny obywatel Wielkiej Lechii"},
  {req:1000000, name: "Fan Igora Grabowskiego"},
  {req:5000000, name: "Bóg klikania ze Starej Otoczni"},
  {req:10000000, name: "Władca Agharty z radiówka od ABP Dzialdowo"},
  {req:50000000, name: "Żyd z Mobilisu"},
  {req:75000000, name: "Wnuk Rothschilda"},
  {req:100000000, name: "WŁADCA IMPERIUM LECHICKIEGO"}
];

// rebirths
let rebirths = parseInt(localStorage.getItem('szpont-rebirths') || '0');
let rebirthMultiplier = 1.0 + (rebirths * 0.75);

export function loadRebirths() {
  rebirths = parseInt(localStorage.getItem('szpont-rebirths') || '0');
  rebirthMultiplier = 1.0 + (rebirths * 0.75);
}
export function getRebirths() { return rebirths; }
export function getRebirthMultiplier() { return rebirthMultiplier; }
export function addRebirth() { rebirths++; localStorage.setItem('szpont-rebirths', rebirths.toString()); rebirthMultiplier = 1.0 + (rebirths * 0.75); }

export function priceFor(def) {
  return Math.floor(def.cost * Math.pow(1.25, def.quantity));
}

export function save() { localStorage.setItem('szpont-state', JSON.stringify(state)); const btn = document.getElementById('save'); if (btn) { btn.textContent='Zapisano!'; setTimeout(()=>btn.textContent='Zapisz',800); } }

export function load() {
  const raw = localStorage.getItem('szpont-state');
  if (raw) { try { Object.assign(state, JSON.parse(raw)); } catch(e){ console.warn('load failed', e); } }
}

export function flashNotEnough(){ const scoreEl = document.getElementById('score'); if (scoreEl) { scoreEl.style.color='red'; setTimeout(()=>scoreEl.style.color='inherit',300); } }

export function computeCPS() {
  let total = 0;
  shopDefinitions.forEach(d => total += (d.cps || 0) * (d.quantity || 0));
  state.cps = total * rebirthMultiplier;
  return state.cps;
}

export function computeClickValue() {
  let v = (state.baseClick + state.clickMultiplier - 1) * rebirthMultiplier;
  shopDefinitions.forEach(d => { if (d.click) v += (d.click * (d.quantity || 0)); });
  return v;
}