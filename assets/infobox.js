document.addEventListener('DOMContentLoaded', async function() {
    const infoDiv = document.getElementById('mlawa-info');
    
    // 1. DATA (lokalnie)
    const dzis = new Date();
    const dni = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const miesiace = ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca", 
                     "Lipca", "Sierpnia", "Września", "Października", "Listopada", "Grudnia"];
    
    const dzienRoku = Math.floor((dzis - new Date(dzis.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // 2. IMENINY (API)
    let imieniny = "Brak danych";
    try {
        const imieninyResp = await fetch(`https://nameday.abalin.net/api/V1/getdate?country=pl&day=${dzis.getDate()}&month=${dzis.getMonth()+1}`);
        if (imieninyResp.ok) {
            const imieninyData = await imieninyResp.json();
            imieniny = imieninyData.nameday?.pl || "Brak danych";
        }
    } catch (e) {
        console.log("API imienin nie działa");
    }
    
    // 3. POGODA MLAWA (API Open-Meteo - bez klucza!)
    let pogodaHTML = "🌡️ Brak danych pogodowych";
    try {
        // Współrzędne Mławy: 53.1125° N, 20.3841° E
        const pogodaResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=53.11&longitude=20.38&current=temperature_2m,weathercode&timezone=Europe%2FWarsaw`);
        
        if (pogodaResp.ok) {
            const pogodaData = await pogodaResp.json();
            const temp = Math.round(pogodaData.current.temperature_2m);
            const kod = pogodaData.current.weathercode;
            
            // Tłumaczenie kodów pogodowych
            const opisy = {
                0: "☀️ Słonecznie", 1: "⛅ Głownie słonecznie", 2: "🌤️ Częściowe zachmurzenie",
                3: "☁️ Pochmurno", 45: "🌫️ Mgła", 48: "🌫️ Mgła szronowa",
                51: "🌦️ Mżawka", 53: "🌦️ Mżawka", 55: "🌦️ Gęsta mżawka",
                61: "🌧️ Lekki deszcz", 63: "🌧️ Deszcz", 65: "🌧️ Ulewa",
                71: "🌨️ Lekki śnieg", 73: "🌨️ Śnieg", 75: "🌨️ Obfity śnieg",
                80: "🌦️ Przepiękna mżawka", 81: "🌧️ Deszcz", 82: "🌧️ Ulewa"
            };
            
            const opis = opisy[kod] || "⛅ Nieznana pogoda";
            pogodaHTML = `<strong>${opis}</strong><br>🌡️ ${temp}°C`;
        }
    } catch (e) {
        console.log("API pogody nie działa");
    }
    
    // 4. FAZA KSIĘŻYCA (obliczenia lokalne)
    function obliczFazeKsiezyca() {
        const LUNAR_CYCLE = 29.53;
        const KNOWN_NEW_MOON = new Date('2024-12-01'); // Ostatni nów
        const diffDays = (dzis - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
        const phase = (diffDays % LUNAR_CYCLE) / LUNAR_CYCLE;
        
        const fazy = [
            {emoji: "🌑", nazwa: "Nów", proc: "0%"},
            {emoji: "🌒", nazwa: "Przybywający sierp", proc: "25%"},
            {emoji: "🌓", nazwa: "I kwadra", proc: "50%"},
            {emoji: "🌔", nazwa: "Przybywający", proc: "75%"},
            {emoji: "🌕", nazwa: "Pełnia", proc: "100%"},
            {emoji: "🌖", nazwa: "Ubywający", proc: "75%"},
            {emoji: "🌗", nazwa: "III kwadra", proc: "50%"},
            {emoji: "🌘", nazwa: "Ubywający sierp", proc: "25%"}
        ];
        
        const index = Math.floor(phase * 8);
        return fazy[index] || fazy[0];
    }
    
    const faza = obliczFazeKsiezyca();
    
    // 5. WYŚWIETLENIE
    infoDiv.innerHTML = `
        <p><strong>${dni[dzis.getDay()]}, ${dzis.getDate()} ${miesiace[dzis.getMonth()]} ${dzis.getFullYear()}</strong><br>
        <small>📆 Dzień ${dzienRoku} z 365</small></p>
        
        <p><strong>🎂 Imieniny:</strong><br>${imieniny}</p>
        
        <p><strong>${faza.emoji} ${faza.nazwa}</strong><br>
        <small>Faza księżyca: ${faza.proc}</small></p>
        
        <p><strong>📍 Mława</strong><br>
        ${pogodaHTML}</p>
        
        <hr style="border: 1px dotted #8ca0c0; margin: 10px 0;">
        
        <p style="font-size: 11px; color: #666;">
        ⌛ Ostatnia aktualizacja: ${String(dzis.getHours()).padStart(2, '0')}:${String(dzis.getMinutes()).padStart(2, '0')}<br>
        <em>Dane pobierane na żywo</em>
        </p>
    `;
});

// Fallback na wypadek błędu
setTimeout(() => {
    if (document.getElementById('mlawa-info').innerHTML.includes('Ładowanie')) {
        document.getElementById('mlawa-info').innerHTML = `
            <p><strong>Błąd ładowania danych</strong></p>
            <p>Odśwież stronę lub spróbuj później.</p>
        `;
    }
}, 5000);