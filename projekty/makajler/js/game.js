(function(){
  let clickTimestamps = [];
  let clickQueue = 0;
  let lastSzpont = 0, lastNachuj = 0, lastKursor = 0, lastKurwa = 0;

  window.detectAutoClicker = function(){
    const now = Date.now();
    clickTimestamps.push(now);
    clickTimestamps = clickTimestamps.filter(ts => now - ts < 1000);
    if (clickTimestamps.length > 18) {
      alert("Zwolnij bo konon zastrzeli cie mlekiem");
      clickTimestamps = [];
    }
  };

  window.processClickQueue = function(){
    if (clickQueue <= 0) return;
    const clicks = clickQueue;
    clickQueue = 0;

    const val = window.computeClickValue();
    window.state.score += val * clicks;

    const soundsToPlay = Math.min(clicks, window.MAX_SOUND_CLICK_BATCH || 25);
    for (let i = 0; i < soundsToPlay; i++){
      ((offset)=>{
        setTimeout(()=>{
          const freq = 900 + Math.min(3000, val * 12);
          window.playClick(freq);
        }, offset);
      })(i * 8);
    }

    checkBonusSoundsAndImages();
  };

  window.queueClick = function(){ clickQueue++; };

  window.tick = function(){
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

  function checkBonusSoundsAndImages(){
    let infl = 1;
    if (window.state.score >= 50000) infl = 4;
    else if (window.state.score >= 20000) infl = 3;
    else if (window.state.score >= 5000) infl = 2;

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
    if (window.state.score - lastNachuj >= 600 * infl) { window.safePlay('nachuj'); lastNachuj = window.state.score; }
    if (window.state.score - lastKursor >= 950 * infl) { window.safePlay('kursor'); lastKursor = window.state.score; }
    if (window.state.score - lastKurwa >= 2000 * infl) { window.safePlay('kurwa'); lastKurwa = window.state.score; }
  }

  window.triggerPunishment = function(){
    localStorage.removeItem('szpont-state');
    window.state.score = 0;
    document.body.innerHTML = '';
    const div = document.createElement('div');
    div.style.position='fixed'; div.style.top=0; div.style.left=0; div.style.width='100vw'; div.style.height='100vh';
    div.style.backgroundColor='black'; div.style.zIndex='9'; div.style.display='flex'; div.style.flexDirection='column';
    div.style.alignItems='center'; div.style.justifyContent='center';
    div.innerHTML = `<img src="https://cdn.discordapp.com/attachments/1412558821817319464/1424500573666938972/Screenshot_20250911-172320_1.png" style="max-width:90%;max-height:60vh;border:4px solid red;border-radius:12px;"><h1 style="color:red;margin-top:20px;font-size:28px;">Wypierdalaj z autoclickerem falszywa kurwo</h1><p style="color:white;font-size:16px;"></p>`;
    document.body.appendChild(div);
  };

  window.performRebirth = function(){
    if (window.state.score < 2500000) { alert("Potrzebujesz przynajmniej 2 500 000 punktów do rebirthu!"); return; }
    if (!confirm("Czy na pewno chcesz sie odrodzić? Stracisz cały postęp, ale zyskasz multiplier")) return;

    window.addRebirth();
    window.state.score = 0;
    window.state.items = {};
    window.shopDefinitions.forEach(def => def.quantity = 0);
    window.recalcCPSUI(); window.recalcClickValueUI(); window.render(); window.renderShop();
    alert(`Witaj ponownie w Wielkiej Lechii. Masz ${window.getRebirthMultiplier().toFixed(2)}x multiplier.`);
  };

  // global buy handler
  window.addEventListener('szpont:buy', (e)=>{
    const defId = e.detail.defId;
    const def = window.shopDefinitions.find(d=>d.id===defId);
    if (!def) return;
    const cost = window.priceFor(def);
    if (window.state.score < cost) { window.flashNotEnough(); return; }
    window.state.score -= cost;
    def.quantity = (def.quantity || 0) + 1;
    window.state.items[def.id] = { quantity: def.quantity };
    window.renderShop(); window.recalcCPSUI(); window.recalcClickValueUI(); window.save();
    if (window.updateRankingPrompt) window.updateRankingPrompt(window.state.score);
  });

  // pointer binding for img (if exists at load time)
  const imgEl = document.getElementById('img');
  if (imgEl) imgEl.addEventListener('pointerdown', ()=>{ window.detectAutoClicker(); window.queueClick(); });

window.recalcCPS = recalcCPS;
window.recalcClickValue = recalcClickValue;
window.render = render;
window.save = save;

})();

