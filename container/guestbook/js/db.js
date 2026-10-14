    import { auth } from "../.././assets/firebase.js";
    import { onAuthStateChanged, signOut }
    from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
    import { updateProfile } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

    const status = document.getElementById("czyzal");
    const link = document.getElementById("loginlink");

    onAuthStateChanged(auth, (user) => {
    if (user) {
        status.textContent = "Zalogowany jako: " + user.displayName;
        link.innerHTML = 'Wyloguj <img src="../../assets/icons/logout.png" alt="*" style="height:12px; width:12px; vertical-align:middle; margin-right:4px;">';
        link.href = "../../index.html";
        link.onclick = (e) => {
        e.preventDefault();
        signOut(auth);
        };
    } else {
        status.textContent = "Nie jesteś zalogowany";
        link.innerHTML = 'Zaloguj się <img style="height:12px; width:12px; vertical-align:middle; margin-right:4px;" src="../../assets/icons/login.png">';
        link.href = "../../login.html";
    }
    });