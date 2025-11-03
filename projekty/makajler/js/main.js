import { load, loadRebirths, computeCPS, computeClickValue } from './state.js';
import './audio.js';
import { initUI, renderShop, render, recalcCPSUI, recalcClickValueUI } from './ui.js';
import { tick, processClickQueue } from './game.js';
import './firebase.js';

// preload images
import { images } from './state.js';
window.__szpont_preloaded_images = images.map(src => { const i = new Image(); i.src = src; return i; });
window.__szpont_current_image = 0;

window.addEventListener('DOMContentLoaded', ()=>{
  load();
  loadRebirths();

  initUI();
  renderShop();
  render();
  recalcCPSUI();
  recalcClickValueUI();

  setInterval(tick, 250);
  setInterval(processClickQueue, 50);
  setInterval(render, 100);
  setInterval(()=>{ save(); recalcCPSUI(); recalcClickValueUI(); }, 10000);
});