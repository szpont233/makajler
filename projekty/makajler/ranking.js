// Pobieramy potrzebne funkcje z Firebase
const { collection, addDoc, getDocs, query, orderBy, limit } = window.firebaseTools;
const db = window.db; // Twój obiekt Firestore
const rankingTable = document.getElementById('ranking');

// Funkcja do ładowania rankingu
async function loadRanking() {
  rankingTable.innerHTML = '<tr><td colspan="2">Ładowanie rankingu...</td></tr>';
  try {
    const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(10));
    const snap = await getDocs(q);

    let html = '<tr><th>Nick</th><th>Punkty</th></tr>';
    snap.forEach(doc => {
      const data = doc.data();
      html += `<tr><td>${data.name}</td><td>${Math.floor(data.score)}</td></tr>`;
    });
    rankingTable.innerHTML = html;
  } catch (e) {
    rankingTable.innerHTML = `<tr><td colspan="2" style="color:red;">Błąd: ${e.message}</td></tr>`;
  }
}

// Funkcja do dodania wyniku
async function updateRankingPrompt(score) {
  const name = prompt("Podaj swój nick, aby dodać się do rankingu:");
  if (!name) return;
  try {
    await addDoc(collection(db, "scores"), {
      name: name,
      score: score,
      date: new Date()
    });
    alert("Dodano do rankingu!");
    loadRanking();
  } catch (e) {
    alert("Błąd zapisu: " + e.message);
  }
}

// Expose do globalnego użycia z HTML
window.updateRankingPrompt = updateRankingPrompt;

// Załaduj ranking przy starcie
loadRanking();
