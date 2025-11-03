import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { state } from './state.js';

const firebaseConfig = {
  apiKey: "AIzaSyACKJG8cU9M3VqZ1rvbawxd1o45PU7oOXU",
  authDomain: "szpontkliker.firebaseapp.com",
  projectId: "szpontkliker",
  storageBucket: "szpontkliker.firebasestorage.app",
  messagingSenderId: "761006393043",
  appId: "1:761006393043:web:a534faff83b8695157b626",
  measurementId: "G-215L6B8F1P"
};

const app = initializeApp(firebaseConfig);
try { getAnalytics(app); } catch(e){}
const db = getFirestore(app);

window.db = db;
window.collection = collection;
window.doc = doc;
window.setDoc = setDoc;
window.getDocs = getDocs;
window.query = query;
window.orderBy = orderBy;
window.limit = limit;

let playerId = localStorage.getItem('szpont-player-id');
if (!playerId) {
  playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('szpont-player-id', playerId);
}
window.playerId = playerId;

export function ensurePlayerName() {
  let playerName = localStorage.getItem('szpont-player-name');
  if (!playerName) {
    playerName = prompt('🏆 Podaj swoją nazwę do rankingu (możesz anulować i podać później):');
    if (playerName && playerName.trim()) {
      playerName = playerName.trim();
      localStorage.setItem('szpont-player-name', playerName);
      updateRanking(playerName, Math.floor(window.state.score || 0));
    }
  }
  return playerName;
}

export async function updateRankingPrompt(score) {
  const playerName = localStorage.getItem('szpont-player-name');
  if (playerName) {
    await updateRanking(playerName, Math.floor(score));
  }
}

export async function updateRanking(name, score) {
  try {
    await setDoc(doc(db, 'scores', playerId), {
      name: name,
      score: score,
      lastUpdate: new Date().toISOString()
    });
    console.log('✅ Ranking zaktualizowany!');
    loadRanking();
  } catch (error) {
    console.error('❌ Błąd zapisu:', error);
  }
}

export async function loadRanking() {
  try {
    const q = query(
      collection(db, 'scores'),
      orderBy('score', 'desc'),
      limit(10)
    );
    const querySnapshot = await getDocs(q);

    const rankingTable = document.getElementById('ranking');
    if (querySnapshot.empty) {
      rankingTable.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:8px;color:#999">Brak wyników</td></tr>';
      return;
    }

    let html = '<tr style="background:#f0f0f0;font-weight:bold"><td>#</td><td>Gracz</td><td>Punkty</td><td>Rebirthy</td></tr>';
    let position = 1;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const isCurrentPlayer = docSnap.id === playerId;
      const rowStyle = isCurrentPlayer ? 'background:#ffffcc;font-weight:bold' : '';

      let medal = '';
      if (position === 1) medal = '🥇';
      else if (position === 2) medal = '🥈';
      else if (position === 3) medal = '🥉';

      html += `<tr style="${rowStyle}">
        <td style="padding:4px">${medal} ${position}</td>
        <td style="padding:4px">${data.name}${isCurrentPlayer ? ' (TY)' : ''}</td>
        <td style="padding:4px;text-align:right">${data.score.toLocaleString()}</td>
        <td style="padding:4px;text-align:center">${data.rebirths || 0}</td>
      </tr>`;
      position++;
    });

    rankingTable.innerHTML = html;
  } catch (error) {
    console.error('Błąd ładowania rankingu:', error);
    const el = document.getElementById('ranking'); if (el) el.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:8px;color:red">Błąd ładowania</td></tr>';
  }
}

// Autostart
setTimeout(() => ensurePlayerName(), 1000);
loadRanking();
setInterval(loadRanking, 30000);

// Hook save -> ranking update
const originalSave = window.save;
window.save = function() { if (typeof originalSave === 'function') originalSave(); if (window.updateRankingPrompt) window.updateRankingPrompt(state.score); };