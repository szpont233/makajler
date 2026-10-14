function initShoutbox() {
    const sb = document.getElementById('floating-shoutbox');
    if (!sb) return;

    // Jeśli szerokość ekranu jest mniejsza niż 768px (standard dla tabletów/telefonów)
    if (window.innerWidth < 768) {
        sb.classList.add('shoutbox-collapsed');
    } else {
        // Na kompie upewniamy się, że jest wysunięty
        sb.classList.remove('shoutbox-collapsed');
    }
}

// Uruchom przy ładowaniu strony
window.addEventListener('DOMContentLoaded', initShoutbox);

// Twoja poprzednia funkcja do klikania (bez zmian)
function toggleShoutbox() {
    const sb = document.getElementById('floating-shoutbox');
    sb.classList.toggle('shoutbox-collapsed');
}