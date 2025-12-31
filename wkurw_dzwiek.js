const ksiegaLink = document.getElementById('cwel');
const oryginalnyTekst = ksiegaLink.innerText;
let flashInterval = null;

function zagrajWitaj() {
    const audio = new Audio('assets/witaj.mp3');
    audio.play().catch(e => console.log("Przeglądarka zablokowała autoodtwarzanie. Kliknij gdzieś na stronę!"));
}

function startFlashing() {
    if (flashInterval) return;

    zagrajWitaj();
    
    let isYellow = false;
    flashInterval = setInterval(() => {
        ksiegaLink.innerText = isYellow ? oryginalnyTekst : "Księga wpisów (1)";
        ksiegaLink.style.backgroundColor = isYellow ? "transparent" : "#ffff00";
        ksiegaLink.style.color = isYellow ? "gold" : "black";
        isYellow = !isYellow;
    }, 500);

    setTimeout(stopFlashing, 10000);
}

function stopFlashing() {
    clearInterval(flashInterval);
    flashInterval = null;
    ksiegaLink.innerText = oryginalnyTekst;
    ksiegaLink.style.backgroundColor = "transparent";
    ksiegaLink.style.color = "gold";
}

ksiegaLink.addEventListener('click', stopFlashing);

function ustawLosowePowiadomienie() {
    const losowyCzas = Math.floor(Math.random() * (180000 - 60000) + 60000);
    setTimeout(() => {
        startFlashing();
        ustawLosowePowiadomienie();
    }, losowyCzas);
}

setTimeout(ustawLosowePowiadomienie, 30000);