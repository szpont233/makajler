import { state, priceFor, shopDefinitions, loadRebirths, addRebirth, computeClickValue } from './state.js';
import { playClick, safePlay, MAX_SOUND_CLICK_BATCH } from './audio.js';
import { renderShop, render, recalcCPSUI, recalcClickValueUI } from './ui.js';


let clickTimestamps = [];
let clickQueue = 0;
let lastSzpont = 0, lastNachuj = 0, lastKursor = 0, lastKurwa = 0;


export function detectAutoClicker() {
const now = Date.now();
clickTimestamps.push(now);
clickTimestamps = clickTimestamps.filter(ts => now - ts < 1000);
if (clickTimestamps.length > 18) {
alert("Zwolnij bo konon zastrzeli cie mlekiem");
clickTimestamps = [];
}
}


export function processClickQueue(){
if (clickQueue <= 0) return;
const clicks = clickQueue;
clickQueue = 0;


const val = computeClickValue();
state.score += val * clicks;


const soundsToPlay = Math.min(clicks, MAX_SOUND_CLICK_BATCH);
for (let i = 0; i < soundsToPlay; i++) {
((offset) => {
setTimeout(() => {
const freq = 900 + Math.min(3000, val * 12);
playClick(freq);
}, offset);
})(i * 8);
}
}