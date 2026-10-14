document.addEventListener('DOMContentLoaded', async () => {
    const infoDiv = document.getElementById('mlawa-info');
    const citySelect = document.getElementById('wybor-miasta');
    if (!infoDiv) return;

    const dzis = new Date();
    const dni = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const miesiace = ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca", "Lipca", "Sierpnia", "Września", "Października", "Listopada", "Grudnia"];

    // Obliczenia daty (z Twojego kodu)
    const start = new Date(dzis.getFullYear(), 0, 0);
    const diff = dzis - start;
    const dzienRoku = Math.floor(diff / (1000 * 60 * 60 * 24));
    const isLeapYear = new Date(dzis.getFullYear(), 1, 29).getDate() === 29;
    const dniWRoku = isLeapYear ? 366 : 365;

    // Imieniny i Księżyc (z Twojego kodu)
    let imieniny = (typeof IMIENINY === "object") ? (IMIENINY[`${dzis.getMonth() + 1}-${dzis.getDate()}`] || "Brak danych") : "Brak danych";
    
    function fazaKsiezyca(date) {
        const LUNAR = 29.53058867;
        const BASE = new Date('2000-01-06T18:14:00Z');
        const days = (date - BASE) / 86400000;
        const phase = (days % LUNAR) / LUNAR;
        const fazy = [
            ["🌑", "Nów", "0%"], ["🌒", "Przybywający sierp", "25%"], ["🌓", "I kwadra", "50%"], ["🌔", "Przybywający", "75%"],
            ["🌕", "Pełnia", "100%"], ["🌖", "Ubywający", "75%"], ["🌗", "III kwadra", "50%"], ["🌘", "Ubywający sierp", "25%"]
        ];
        return fazy[Math.floor(phase * 8)] || fazy[0];
    }
    const [emoji, nazwa, proc] = fazaKsiezyca(dzis);

    async function updateWeather(lat, lon, cityName) {
        const weatherContainer = document.getElementById('weather-box');
        if (weatherContainer) weatherContainer.innerHTML = "Tlumaczenie sygnalów z mongolskiego...";

        try {
            const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode&timezone=Europe%2FWarsaw`);
            if (r.ok) {
                const d = await r.json();
                const temp = Math.round(d.current.temperature_2m);
                const kod = d.current.weathercode;
                const opisy = { 0: "☀️ Słonecznie", 1: "⛅ Głównie słonecznie", 2: "🌤️ Częściowe zachmurzenie", 3: "☁️ Pochmurno", 45: "🌫️ Mgła", 61: "🌧️ Lekki deszcz", 63: "🌧️ Deszcz", 71: "🌨️ Śnieg" };
                
                document.getElementById('weather-box').innerHTML = `
                    <strong>📍 ${cityName}</strong><br>
                    ${opisy[kod] || "Pogoda nieznana. Jestesmy w czarnej dupie"}<br>
                    🌡️ ${temp}°C
                `;
            }
        } catch {
            if (weatherContainer) weatherContainer.innerHTML = "Bląd: Sygnal z mongolami zerwany";
        }
    }

    infoDiv.innerHTML = `
        <p><strong>${dni[dzis.getDay()]}, ${dzis.getDate()} ${miesiace[dzis.getMonth()]}</strong><br>
        <small>📆 Dzień ${dzienRoku} z ${dniWRoku}</small></p>
        <p><strong>🎂 Imieniny:</strong><br>${imieniny}</p>
        <p><strong>${emoji} ${nazwa}</strong><br>
        <small>Faza księżyca: ${proc}</small></p>
        <hr>
        <div id="weather-box">Tlumaczenie sygnalow z mongolskiego...</div>
    `;

    // Obsługa zmiany miasta
    citySelect.addEventListener('change', (e) => {
        const [lat, lon, name] = e.target.value.split(',');
        updateWeather(lat, lon, name);
    });

    // Startowa pogoda dla stolicy
    updateWeather(53.07,20.35, "Stara Otocznia");
});