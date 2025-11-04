(function(){
  const scoreEl = document.getElementById('score');
  const cpsEl = document.getElementById('cps');
  const clickValueEl = document.getElementById('clickValue');
  const shopEl = document.getElementById('shop');
  const achievementsEl = document.getElementById('achievements');
  const levelEl = document.getElementById('level');
  const img = document.getElementById('img');

  window.recalcCPSUI = function(){
    const v = window.computeCPS();
    if (cpsEl) cpsEl.textContent = v.toFixed(2);
  };

  window.recalcClickValueUI = function(){
    const v = window.computeClickValue();
    if (clickValueEl) clickValueEl.textContent = v.toFixed(2);
    return v;
  };

  window.renderShop = function(){
    if(!shopEl) return;
    shopEl.innerHTML = '';
    window.shopDefinitions.forEach(def=>{
      const item = window.state.items[def.id] || {quantity:0};
      def.quantity = item.quantity || 0;
      const wrapper = document.createElement('div');
      wrapper.className = 'shop-item';
      wrapper.innerHTML = `<div><strong>${def.name}</strong><small>${def.desc}</small><div style="font-size:12px;color:#666">Posiadasz: ${def.quantity}</div></div><div style="text-align:right"><div style="font-weight:bold">${window.priceFor(def)} €</div><button data-id="${def.id}">Kup</button></div>`;
      shopEl.appendChild(wrapper);
      wrapper.querySelector('button').addEventListener('click',()=>{
        const ev = new CustomEvent('szpont:buy',{detail:{defId:def.id}});
        window.dispatchEvent(ev);
      });
    });
  };

  window.renderAchievements = function(){
    if(!achievementsEl) return;
    achievementsEl.innerHTML = '';
    window.achDefs.forEach(a=>{
      const unlocked = a.check(window.state);
      const el = document.createElement('div');
      el.textContent = a.label + (unlocked ? ' OK' : '');
      achievementsEl.appendChild(el);
    });
  };

  window.renderLevel = function(){
    if(!levelEl) return;
    const lvl = window.levels.slice().reverse().find(l => window.state.score >= l.req) || window.levels[0];
    const lvlIndex = window.levels.indexOf(lvl) + 1;
    levelEl.textContent = `Poziom ${lvlIndex} – ${lvl.name}`;
  };

  window.render = function(){
    if(scoreEl) scoreEl.textContent = Math.floor(window.state.score);
    window.renderLevel();
    window.renderAchievements();
  };

  window.initUI = function(){
    const resetBtn = document.getElementById('reset');
    const saveBtn = document.getElementById('save');
    const dzwBtn = document.getElementById('dzwieki');
    if(resetBtn) resetBtn.addEventListener('click', ()=>{
      if (!confirm('Chcesz cofnąć sie do epoki kamienia łupanego?')) return;
      localStorage.removeItem('szpont-state');
      location.reload();
    });
    if(saveBtn) saveBtn.addEventListener('click', ()=>{ window.save(); });
    if(dzwBtn) dzwBtn.addEventListener('click', ()=>{
      const muted = window.toggleMute();
      dzwBtn.textContent = muted ? 'Włącz dźwięki' : 'Wyłącz dźwięki';
    });
  };

})();