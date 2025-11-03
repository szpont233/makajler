// main.js — inicjalizacja (globalne API już dostępne przez window)
(function(){
  // preload images
  window.__szpont_preloaded_images = (window.images || []).map(src => { const i = new Image(); i.src = src; return i; });
  window.__szpont_current_image = 0;

  // Początkowa inicjalizacja po DOMContentLoaded
  window.addEventListener('DOMContentLoaded', ()=>{
    if (typeof window.load === 'function') window.load();
    if (typeof window.loadRebirths === 'function') window.loadRebirths();

    if (typeof window.initUI === 'function') window.initUI();
    if (typeof window.renderShop === 'function') window.renderShop();
    if (typeof window.render === 'function') window.render();
    if (typeof window.recalcCPSUI === 'function') window.recalcCPSUI();
    if (typeof window.recalcClickValueUI === 'function') window.recalcClickValueUI();

    // Intervals
    if (typeof window.tick === 'function') setInterval(window.tick, 250);
    if (typeof window.processClickQueue === 'function') setInterval(window.processClickQueue, 50);
    if (typeof window.render === 'function') setInterval(window.render, 100);
    setInterval(()=>{ if (typeof window.save === 'function') window.save(); if (typeof window.recalcCPSUI === 'function') window.recalcCPSUI(); if (typeof window.recalcClickValueUI === 'function') window.recalcClickValueUI(); }, 10000);
  });

})();