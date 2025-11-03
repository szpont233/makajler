let audioCtx = null;
let wyciszone = false;
const POOL_SIZE = 8;
const MAX_SOUND_CLICKS_PER_TICK = 25;
let oscPool = null;
let oscPoolIndex = 0;
let lastSoundTime = 0;


export function isMuted() { return wyciszone; }
export function toggleMute() { wyciszone = !wyciszone; return wyciszone; }


export function ensureAudioCtx() {
if (!audioCtx) {
audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
if (!oscPool) initOscPool();
}


function initOscPool() {
oscPool = [];
for (let i = 0; i < POOL_SIZE; i++) {
const o = audioCtx.createOscillator();
const g = audioCtx.createGain();
o.type = 'square';
g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
o.connect(g);
g.connect(audioCtx.destination);
o.start();
oscPool.push({ o, g, busyUntil: 0 });
}
}


export function playClick(freq = 1280) {
if (wyciszone) return;
ensureAudioCtx();


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


const fallback = oscPool[(oscPoolIndex++) % POOL_SIZE];
try {
const now2 = audioCtx.currentTime;
fallback.o.frequency.setValueAtTime(freq, now2);
fallback.g.gain.cancelScheduledValues(now2);
fallback.g.gain.setValueAtTime(0.06, now2);
fallback.g.gain.exponentialRampToValueAtTime(0.0001, now2 + 0.06);
fallback.busyUntil = now2 + 0.07;
} catch (e) {}
}


export function safePlay(id) {
if (wyciszone) return;
const now = Date.now();
if (now - lastSoundTime < 250) return;
lastSoundTime = now;
const a = document.getElementById(id);
if (!a) return;
try { a.currentTime = 0; a.play().catch(()=>{}); } catch (e) {}
}


export const MAX_SOUND_CLICK_BATCH = MAX_SOUND_CLICKS_PER_TICK;