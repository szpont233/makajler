document.addEventListener('DOMContentLoaded', async () => {
    const infoDiv = document.getElementById('mlawa-info');
    if (!infoDiv) return;

    const dzis = new Date();

    const dni = [
        "Niedziela", "Poniedziałek", "Wtorek",
        "Środa", "Czwartek", "Piątek", "Sobota"
    ];

    const miesiace = [
        "Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca",
        "Lipca", "Sierpnia", "Września", "Października", "Listopada", "Grudnia"
    ];

    // --- Dzień roku + lata przestępne ---
    const start = new Date(dzis.getFullYear(), 0, 0);
    const diff = dzis - start;
    const dzienRoku = Math.floor(diff / (1000 * 60 * 60 * 24));

    const isLeapYear = new Date(dzis.getFullYear(), 1, 29).getDate() === 29;
    const dniWRoku = isLeapYear ? 366 : 365;

    // --- Imieniny ---
    let imieniny = "Brak danych";
    if (typeof IMIENINY === "object") {
        const key = `${dzis.getMonth() + 1}-${dzis.getDate()}`;
        imieniny = IMIENINY[key] || "Brak danych";
    }


    // --- Pogoda Mława ---
    let pogodaHTML = "🌡️ Brak danych";
    try {
        const r = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=53.11&longitude=20.38&current=temperature_2m,weathercode&timezone=Europe%2FWarsaw"
        );
        if (r.ok) {
            const d = await r.json();
            const temp = Math.round(d.current.temperature_2m);
            const kod = d.current.weathercode;
            const godzina = d.current.time.slice(11, 16);

            const opisy = {
                0: "☀️ Słonecznie",
                1: "⛅ Głównie słonecznie",
                2: "🌤️ Częściowe zachmurzenie",
                3: "☁️ Pochmurno",
                45: "🌫️ Mgła",
                48: "🌫️ Mgła szronowa",
                51: "🌦️ Mżawka",
                53: "🌦️ Mżawka",
                55: "🌦️ Gęsta mżawka",
                61: "🌧️ Lekki deszcz",
                63: "🌧️ Deszcz",
                65: "🌧️ Ulewa",
                71: "🌨️ Lekki śnieg",
                73: "🌨️ Śnieg",
                75: "🌨️ Obfity śnieg"
            };

            pogodaHTML = `
                <strong>${opisy[kod] || "⛅ Pogoda nieznana"}</strong><br>
                🌡️ ${temp}°C<br><br>
                <small>⌛ Ostatnia aktualizacja: ${godzina}</small>
            `;
        }
    } catch {}

    // --- Faza Księżyca (stabilna) ---
    function fazaKsiezyca(date) {
        const LUNAR = 29.53058867;
        const BASE = new Date('2000-01-06T18:14:00Z');
        const days = (date - BASE) / 86400000;
        const phase = (days % LUNAR) / LUNAR;

        const fazy = [
            ["🌑", "Nów", "0%"],
            ["🌒", "Przybywający sierp", "25%"],
            ["🌓", "I kwadra", "50%"],
            ["🌔", "Przybywający", "75%"],
            ["🌕", "Pełnia", "100%"],
            ["🌖", "Ubywający", "75%"],
            ["🌗", "III kwadra", "50%"],
            ["🌘", "Ubywający sierp", "25%"]
        ];

        return fazy[Math.floor(phase * 8)] || fazy[0];
    }

    const [emoji, nazwa, proc] = fazaKsiezyca(dzis);

    // --- Render ---
    infoDiv.innerHTML = `
        <p><strong>${dni[dzis.getDay()]}, ${dzis.getDate()} ${miesiace[dzis.getMonth()]} ${dzis.getFullYear()}</strong><br>
        <small>📆 Dzień ${dzienRoku} z ${dniWRoku}</small></p>

        <p><strong>🎂 Imieniny:</strong><br>${imieniny}</p>

        <p><strong>${emoji} ${nazwa}</strong><br>
        <small>Faza księżyca: ${proc}</small></p>

        <p><strong>📍 Mława</strong><br>${pogodaHTML}</p>

        </p>
    `;
});

// fallback
setTimeout(() => {
    const el = document.getElementById('mlawa-info');
    if (el && el.textContent.includes('Ładowanie')) {
        el.innerHTML = "<p><strong>Błąd ładowania danych</strong></p>";
    }
}, 5000);
