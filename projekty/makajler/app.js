// =============================================================================
// SZPONTKLIKIER — scalony plik JS z 9 plików w 1 dzięki Claude.
// Kolejność: state → audio → game → ui → firebase → main
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// STATE & DANE
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  window.state = {
    score: 0,
    baseClick: 1,
    clickMultiplier: 1,
    cps: 0,
    items: {},
    lastTick: Date.now()
  };

  window.images = [
    'assets/img/baza0.png',
    'assets/img/baza1.png',
    'assets/img/baza2.png'
  ];

  window.shopDefinitions = [
    { id: 'popit',     name: 'Sąsiad',                       cost: 15,    cps: 0.1, click: 0,  quantity: 0, desc: '+0.1 CPS' },
    { id: 'konsola',   name: 'Argentyńskie bydło',            cost: 100,   cps: 1,   click: 0,  quantity: 0, desc: '+1 CPS' },
    { id: 'kawa',      name: 'Kawa + fajka na śniadanie',     cost: 250,   cps: 0,   click: 1,  quantity: 0, desc: '+1 do kliknięcia' },
    { id: 'guru',      name: 'Plebsowy GPT 6-7',              cost: 1200,  cps: 10,  click: 0,  quantity: 0, desc: '+10 CPS' },
    { id: 'boost',     name: 'Kwantowy GPT-7.6',              cost: 5000,  cps: 0,   click: 10, quantity: 0, desc: '+10 do kliknięcia' },
    { id: 'ojczysta',  name: 'Ojczysta 100%',                 cost: 10000, cps: 0,   click: 20, quantity: 0, desc: '+20 do kliknięcia' }
  ];

  window.achDefs = [
    { id: '10',       label: '10 klikesow',           check: st => Math.floor(st.score) >= 10 },
    { id: '100',      label: '100 pkt',               check: st => Math.floor(st.score) >= 100 },
    { id: 'firstbuy', label: 'Pierwszy zakup',        check: st => Object.keys(st.items).length > 0 },
    { id: '10m',      label: '10 milionów kliknięć?!', check: st => st.score >= 10_000_000 },
    { id: '40m',      label: 'Legenda Szpontoklikera', check: st => st.score >= 40_000_000 }
  ];

  window.levels = [
    { req: 0,         name: 'Zbieracz kiepów' },
    { req: 500,       name: 'Bezrobotny renciarz' },
    { req: 1000,      name: 'Robotnik z socjalem' },
    { req: 5000,      name: 'Kierorwnik zegarka OREGON SCIENTIFIC' },
    { req: 10000,     name: 'Menadżer pilotu od telewizora' },
    { req: 15000,     name: 'Dyrektor PKS Dzialdowo S.A' },
    { req: 25000,     name: 'Prezes Szpont Holding z Cypru' },
    { req: 50000,     name: 'Szpont Obajtek' },
    { req: 100000,    name: 'Przemytnik dzialek na Ksiezycu' },
    { req: 250000,    name: 'Użytkownik kierownicy Espranaza' },
    { req: 500000,    name: 'Oficjalny obywatel Wielkiej Lechii' },
    { req: 1000000,   name: 'Fan Igora Grabowskiego' },
    { req: 5000000,   name: 'Bóg klikania ze Starej Otoczni' },
    { req: 10000000,  name: 'Władca Agharty z radiówka od ABP Dzialdowo' },
    { req: 50000000,  name: 'Żyd z Mobilisu' },
    { req: 75000000,  name: 'Wnuk Rothschilda' },
    { req: 100000000, name: 'WŁADCA IMPERIUM LECHICKIEGO' }
  ];

  // ── Rebirthy ──
  window.__szpont_rebirths = parseInt(localStorage.getItem('szpont-rebirths') || '0');

  function updateRebirthMultiplier() {
    window.__szpont_rebirthMultiplier = 1.0 + (window.__szpont_rebirths * 0.75);
  }
  updateRebirthMultiplier();

  window.loadRebirths = function () {
    window.__szpont_rebirths = parseInt(localStorage.getItem('szpont-rebirths') || '0');
    updateRebirthMultiplier();
  };
  window.getRebirths = function () { return window.__szpont_rebirths; };
  window.getRebirthMultiplier = function () { return window.__szpont_rebirthMultiplier; };
  window.addRebirth = function () {
    window.__szpont_rebirths++;
    localStorage.setItem('szpont-rebirths', window.__szpont_rebirths.toString());
    updateRebirthMultiplier();
  };

  // ── Helpers ──
  window.priceFor = function (def) {
    return Math.floor(def.cost * Math.pow(1.25, def.quantity || 0));
  };

  window.save = function () {
    localStorage.setItem('szpont-state', JSON.stringify(window.state));
    const btn = document.getElementById('save');
    if (btn) { btn.textContent = 'Zapisano!'; setTimeout(() => btn.textContent = 'Zapisz', 800); }
  };

  window.load = function () {
    const raw = localStorage.getItem('szpont-state');
    if (raw) { try { Object.assign(window.state, JSON.parse(raw)); } catch (e) { console.warn('load failed', e); } }
  };

  window.flashNotEnough = function () {
    const scoreEl = document.getElementById('score');
    if (scoreEl) { scoreEl.style.color = 'red'; setTimeout(() => scoreEl.style.color = 'inherit', 300); }
  };

  window.computeCPS = function () {
    let total = 0;
    window.shopDefinitions.forEach(d => total += (d.cps || 0) * (d.quantity || 0));
    window.state.cps = total * window.getRebirthMultiplier();
    return window.state.cps;
  };

  window.computeClickValue = function () {
    let v = (window.state.baseClick + window.state.clickMultiplier - 1) * window.getRebirthMultiplier();
    window.shopDefinitions.forEach(d => { if (d.click) v += d.click * (d.quantity || 0); });
    return v;
  };
})();


// ─────────────────────────────────────────────────────────────────────────────
// AUDIO
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  let audioCtx = null;
  let wyciszone = false;
  const POOL_SIZE = 8;
  const MAX_SOUND_CLICKS_PER_TICK = 25;
  let oscPool = null;
  let oscPoolIndex = 0;
  let lastSoundTime = 0;

  window.MAX_SOUND_CLICK_BATCH = MAX_SOUND_CLICKS_PER_TICK;

  window.isMuted = function () { return wyciszone; };
  window.toggleMute = function () { wyciszone = !wyciszone; return wyciszone; };

  window.ensureAudioCtx = function () {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (!oscPool) initOscPool();
  };

  function initOscPool() {
    oscPool = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'square';
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      o.connect(g);
      g.connect(audioCtx.destination);
      try { o.start(); } catch (e) {}
      oscPool.push({ o, g, busyUntil: 0 });
    }
  }

  window.playClick = function (freq = 1280) {
    if (wyciszone) return;
    window.ensureAudioCtx();
    const now = audioCtx.currentTime;

    for (let attempts = 0; attempts < POOL_SIZE; attempts++) {
      const idx = (oscPoolIndex++) % POOL_SIZE;
      const node = oscPool[idx];
      if (audioCtx.currentTime >= node.busyUntil) {
        try {
          node.o.frequency.setValueAtTime(freq, now);
          node.g.gain.cancelScheduledValues(now);
          node.g.gain.setValueAtTime(0.15, now);
          node.g.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
          node.busyUntil = now + 0.09;
        } catch (e) {}
        return;
      }
    }

    // fallback — użyj któregokolwiek
    const fallback = oscPool[(oscPoolIndex++) % POOL_SIZE];
    try {
      const now2 = audioCtx.currentTime;
      fallback.o.frequency.setValueAtTime(freq, now2);
      fallback.g.gain.cancelScheduledValues(now2);
      fallback.g.gain.setValueAtTime(0.06, now2);
      fallback.g.gain.exponentialRampToValueAtTime(0.0001, now2 + 0.06);
      fallback.busyUntil = now2 + 0.07;
    } catch (e) {}
  };

  window.safePlay = function (id) {
    if (wyciszone) return;
    const now = Date.now();
    if (now - lastSoundTime < 250) return;
    lastSoundTime = now;
    const a = document.getElementById(id);
    if (!a) return;
    try { a.currentTime = 0; a.play().catch(() => {}); } catch (e) {}
  };
})();


// ─────────────────────────────────────────────────────────────────────────────
// GAME LOGIC
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  let clickTimestamps = [];
  let clickQueue = 0;
  let lastSzpont = 0, lastNachuj = 0, lastKursor = 0, lastKurwa = 0;

  window.detectAutoClicker = function () {
    const now = Date.now();
    clickTimestamps.push(now);
    clickTimestamps = clickTimestamps.filter(ts => now - ts < 1000);
    if (clickTimestamps.length > 18) {
      alert('Zwolnij bo konon zastrzeli cie mlekiem');
      clickTimestamps = [];
    }
  };

  window.processClickQueue = function () {
    if (clickQueue <= 0) return;
    const clicks = clickQueue;
    clickQueue = 0;

    const val = window.computeClickValue();
    window.state.score += val * clicks;

    const soundsToPlay = Math.min(clicks, window.MAX_SOUND_CLICK_BATCH || 25);
    for (let i = 0; i < soundsToPlay; i++) {
      ((offset) => {
        setTimeout(() => {
          window.playClick(900 + Math.min(3000, val * 12));
        }, offset);
      })(i * 8);
    }

    checkBonusSoundsAndImages();
  };

  window.queueClick = function () { clickQueue++; };

  window.tick = function () {
    const now = Date.now();
    const dt = (now - window.state.lastTick) / 1000.0;
    window.state.lastTick = now;
    if (dt > 3) return;
    if (window.state.cps > 0) {
      let cps = window.state.cps;
      if (cps > 2000) cps = 2000 + Math.log10(cps) * 100;
      window.state.score += cps * dt;
    }
  };

  function checkBonusSoundsAndImages() {
    let infl = 1;
    if      (window.state.score >= 50000) infl = 4;
    else if (window.state.score >= 20000) infl = 3;
    else if (window.state.score >= 5000)  infl = 2;

    if (window.state.score - lastSzpont >= 300 * infl) {
      const img = document.getElementById('img');
      const preloaded = window.__szpont_preloaded_images || [];
      if (img && preloaded.length) {
        window.__szpont_current_image = (window.__szpont_current_image + 1) % preloaded.length;
        img.src = preloaded[window.__szpont_current_image].src;
      }
      window.safePlay('szpont');
      lastSzpont = window.state.score;
    }
    if (window.state.score - lastNachuj >= 600  * infl) { window.safePlay('nachuj'); lastNachuj = window.state.score; }
    if (window.state.score - lastKursor >= 950  * infl) { window.safePlay('kursor'); lastKursor = window.state.score; }
    if (window.state.score - lastKurwa  >= 2000 * infl) { window.safePlay('kurwa');  lastKurwa  = window.state.score; }
  }

  window.triggerPunishment = function () {
    localStorage.removeItem('szpont-state');
    window.state.score = 0;
    document.body.innerHTML = '';
    const div = document.createElement('div');
    Object.assign(div.style, {
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'black', zIndex: '9', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    });
    div.innerHTML = `
      <img src="https://cdn.discordapp.com/attachments/1412558821817319464/1424500573666938972/Screenshot_20250911-172320_1.png"
           style="max-width:90%;max-height:60vh;border:4px solid red;border-radius:12px;">
      <h1 style="color:red;margin-top:20px;font-size:28px;">Wypierdalaj z autoclickerem falszywa kurwo</h1>`;
    document.body.appendChild(div);
  };

  window.performRebirth = function () {
    if (window.state.score < 2500000) { alert('Potrzebujesz przynajmniej 2 500 000 punktów do rebirthu!'); return; }
    if (!confirm('Czy na pewno chcesz sie odrodzić? Stracisz cały postęp, ale zyskasz multiplier')) return;

    window.addRebirth();
    window.state.score = 0;
    window.state.items = {};
    window.shopDefinitions.forEach(def => def.quantity = 0);
    window.recalcCPSUI();
    window.recalcClickValueUI();
    window.render();
    window.renderShop();
    alert(`Witaj ponownie w Wielkiej Lechii. Masz ${window.getRebirthMultiplier().toFixed(2)}x multiplier.`);
  };

  // Obsługa zakupów
  window.addEventListener('szpont:buy', (e) => {
    const def = window.shopDefinitions.find(d => d.id === e.detail.defId);
    if (!def) return;
    const cost = window.priceFor(def);
    if (window.state.score < cost) { window.flashNotEnough(); return; }
    window.state.score -= cost;
    def.quantity = (def.quantity || 0) + 1;
    window.state.items[def.id] = { quantity: def.quantity };
    window.renderShop();
    window.recalcCPSUI();
    window.recalcClickValueUI();
    window.save();
    if (window.updateRankingPrompt) window.updateRankingPrompt(window.state.score);
  });

  // Bindowanie kliknięcia na obrazek
  const imgEl = document.getElementById('img');
  if (imgEl) imgEl.addEventListener('pointerdown', () => {
    window.detectAutoClicker();
    window.queueClick();
  });
})();


// ─────────────────────────────────────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  const scoreEl       = document.getElementById('score');
  const cpsEl         = document.getElementById('cps');
  const clickValueEl  = document.getElementById('clickValue');
  const shopEl        = document.getElementById('shop');
  const achievementsEl = document.getElementById('achievements');
  const levelEl       = document.getElementById('level');

  window.recalcCPSUI = function () {
    const v = window.computeCPS();
    if (cpsEl) cpsEl.textContent = v.toFixed(2);
  };

  window.recalcClickValueUI = function () {
    const v = window.computeClickValue();
    if (clickValueEl) clickValueEl.textContent = v.toFixed(2);
    return v;
  };

  window.renderShop = function () {
    if (!shopEl) return;
    shopEl.innerHTML = '';
    window.shopDefinitions.forEach(def => {
      const item = window.state.items[def.id] || { quantity: 0 };
      def.quantity = item.quantity || 0;
      const wrapper = document.createElement('div');
      wrapper.className = 'shop-item';
      wrapper.innerHTML = `
        <div>
          <strong>${def.name}</strong>
          <small>${def.desc}</small>
          <div style="font-size:12px;color:#666">Posiadasz: ${def.quantity}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:bold">${window.priceFor(def)} €</div>
          <button data-id="${def.id}">Kup</button>
        </div>`;
      shopEl.appendChild(wrapper);
      wrapper.querySelector('button').addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('szpont:buy', { detail: { defId: def.id } }));
      });
    });
  };

  window.renderAchievements = function () {
    if (!achievementsEl) return;
    achievementsEl.innerHTML = '';
    window.achDefs.forEach(a => {
      const el = document.createElement('div');
      el.textContent = a.label + (a.check(window.state) ? ' ✅' : '');
      achievementsEl.appendChild(el);
    });
  };

  window.renderLevel = function () {
    if (!levelEl) return;
    const lvl = window.levels.slice().reverse().find(l => window.state.score >= l.req) || window.levels[0];
    levelEl.textContent = `Poziom ${window.levels.indexOf(lvl) + 1} – ${lvl.name}`;
  };

  window.render = function () {
    if (scoreEl) scoreEl.textContent = Math.floor(window.state.score);
    window.renderLevel();
    window.renderAchievements();
  };

  window.initUI = function () {
    const resetBtn = document.getElementById('reset');
    const saveBtn  = document.getElementById('save');
    const dzwBtn   = document.getElementById('dzwieki');

    if (resetBtn) resetBtn.addEventListener('click', () => {
      if (!confirm('Chcesz cofnąć sie do epoki kamienia łupanego?')) return;
      localStorage.removeItem('szpont-state');
      location.reload();
    });
    if (saveBtn) saveBtn.addEventListener('click', () => window.save());
    if (dzwBtn) dzwBtn.addEventListener('click', () => {
      dzwBtn.textContent = window.toggleMute() ? 'Włącz dźwięki' : 'Wyłącz dźwięki';
    });
  };
})();


// ─────────────────────────────────────────────────────────────────────────────
// FIREBASE / RANKING
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics }  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy, limit }
  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

(function () {
  const firebaseConfig = {
    apiKey:            'AIzaSyACKJG8cU9M3VqZ1rvbawxd1o45PU7oOXU',
    authDomain:        'szpontkliker.firebaseapp.com',
    projectId:         'szpontkliker',
    storageBucket:     'szpontkliker.firebasestorage.app',
    messagingSenderId: '761006393043',
    appId:             '1:761006393043:web:a534faff83b8695157b626',
    measurementId:     'G-215L6B8F1P'
  };

  const app = initializeApp(firebaseConfig);
  try { getAnalytics(app); } catch (e) {}
  const db = getFirestore(app);

  // Eksportuj na window dla kompatybilności (używane np. przez ranking HTML)
  window.db = db;

  let playerId = localStorage.getItem('szpont-player-id');
  if (!playerId) {
    playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('szpont-player-id', playerId);
  }
  window.playerId = playerId;

  window.ensurePlayerName = function () {
    let playerName = localStorage.getItem('szpont-player-name');
    if (!playerName) {
      playerName = prompt('🏆 Podaj swoją nazwę do rankingu (możesz anulować i podać później):');
      if (playerName && playerName.trim()) {
        playerName = playerName.trim();
        localStorage.setItem('szpont-player-name', playerName);
        window.updateRanking(playerName, Math.floor(window.state.score || 0));
      }
    }
    return playerName;
  };

  window.updateRankingPrompt = async function (score) {
    const playerName = localStorage.getItem('szpont-player-name');
    if (playerName) await window.updateRanking(playerName, Math.floor(score));
  };

  window.updateRanking = async function (name, score) {
    try {
      await setDoc(doc(db, 'scores', playerId), {
        name,
        score,
        lastUpdate: new Date().toISOString()
      });
      console.log('✅ Ranking zaktualizowany!');
      window.loadRanking();
    } catch (error) {
      console.error('❌ Błąd zapisu:', error);
    }
  };

  window.loadRanking = async function () {
    const rankingTable = document.getElementById('ranking');
    if (!rankingTable) return;
    try {
      const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(10));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        rankingTable.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:8px;color:#999">Brak wyników</td></tr>';
        return;
      }

      const medals = ['🥇', '🥈', '🥉'];
      let html = '<tr style="background:#f0f0f0;font-weight:bold"><td>#</td><td>Gracz</td><td>Punkty</td><td>Rebirthy</td></tr>';
      let pos = 1;

      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        const isMe = docSnap.id === playerId;
        html += `<tr style="${isMe ? 'background:#ffffcc;font-weight:bold' : ''}">
          <td style="padding:4px">${medals[pos - 1] || ''} ${pos}</td>
          <td style="padding:4px">${d.name}${isMe ? ' (TY)' : ''}</td>
          <td style="padding:4px;text-align:right">${d.score.toLocaleString()}</td>
          <td style="padding:4px;text-align:center">${d.rebirths || 0}</td>
        </tr>`;
        pos++;
      });

      rankingTable.innerHTML = html;
    } catch (error) {
      console.error('Błąd ładowania rankingu:', error);
      rankingTable.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:8px;color:red">Błąd ładowania</td></tr>';
    }
  };

  // Hook na window.save → aktualizacja rankingu
  const _origSave = window.save;
  window.save = function () {
    if (typeof _origSave === 'function') _origSave();
    if (window.updateRankingPrompt) window.updateRankingPrompt(window.state.score);
  };

  // Autostart
  setTimeout(() => window.ensurePlayerName(), 1000);
  window.loadRanking();
  setInterval(window.loadRanking, 30000);
})();


// ─────────────────────────────────────────────────────────────────────────────
// ADMIN PANEL (ukryty)
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  const _s = atob('U3RhcmFPdG9jem5pYUltcGVyaXVtMjcx');

  const btn = Object.assign(document.createElement('button'), {
    textContent: 'Admin panel'
  });
  Object.assign(btn.style, {
    position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999,
    padding: '8px', background: 'red', color: 'white',
    border: 'none', borderRadius: '4px', fontWeight: 'bold'
  });
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    if (prompt('Podaj hasło:') !== _s) { alert('Błędne hasło!'); return; }

    const scoreAmount      = parseFloat(prompt('Points:')) || 0;
    const cpsAmount        = parseFloat(prompt('CPS:'));
    const clickValueAmount = parseFloat(prompt('Clicks:'));

    window.state.score += scoreAmount;
    if (!isNaN(cpsAmount))        window.state.cps       = cpsAmount;
    if (!isNaN(clickValueAmount)) window.state.baseClick  = clickValueAmount;

    window.computeCPS();
    window.computeClickValue();
    window.render();
    window.save();

    alert(`Zaktualizowano:\nPunkty: +${scoreAmount}\nCPS: ${!isNaN(cpsAmount) ? cpsAmount : 'bez zmian'}\nKliknięcie: ${!isNaN(clickValueAmount) ? clickValueAmount : 'bez zmian'}`);
  });
})();


// ─────────────────────────────────────────────────────────────────────────────
// MAIN — inicjalizacja po DOMContentLoaded
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  window.__szpont_preloaded_images = (window.images || []).map(src => {
    const i = new Image(); i.src = src; return i;
  });
  window.__szpont_current_image = 0;

  window.addEventListener('DOMContentLoaded', () => {
    if (typeof window.load         === 'function') window.load();
    if (typeof window.loadRebirths === 'function') window.loadRebirths();
    if (typeof window.initUI       === 'function') window.initUI();
    if (typeof window.renderShop   === 'function') window.renderShop();
    if (typeof window.render       === 'function') window.render();
    if (typeof window.recalcCPSUI        === 'function') window.recalcCPSUI();
    if (typeof window.recalcClickValueUI === 'function') window.recalcClickValueUI();

    setInterval(window.tick,               250);
    setInterval(window.processClickQueue,   50);
    setInterval(window.render,             100);
    setInterval(() => {
      window.save();
      window.recalcCPSUI();
      window.recalcClickValueUI();
    }, 10000);
  });
})();