    import { auth, db } from '../../assets/firebase.js';
    import {
      collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc
    } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

    function formatDate(timestamp) {
        if (!timestamp) return "Teraz";
        const date = timestamp.toDate();
        return date.toLocaleString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function sanitizeHtml(str) {
        // Tworzymy tymczasowy element DOM
        const temp = document.createElement('div');
        temp.innerHTML = str;

        // Iterujemy po wszystkich elementach
        const allowedTags = ['A', 'IMG', 'P'];

        function clean(node) {
            // Jeśli node to element
            if (node.nodeType === 1) {
                if (!allowedTags.includes(node.tagName)) {
                    // Zastępujemy node jego tekstem
                    const text = document.createTextNode(node.textContent);
                    node.parentNode.replaceChild(text, node);
                } else {
                    // Dozwolone tagi: dodatkowo czyścimy atrybuty
                    if (node.tagName === 'A') {
                        const href = node.getAttribute('href');
                        node.setAttribute('href', href || '#');
                        node.setAttribute('target', '_blank'); // bezpieczeństwo
                    }
                    if (node.tagName === 'P') {
                        const href = node.getAttribute('href');
                        node.setAttribute('href', href || '#');
                        node.setAttribute('target', '_blank');
                    }
                    if (node.tagName === 'IMG') {
                        const src = node.getAttribute('src');
                        node.setAttribute('src', src || '');
                        node.setAttribute('alt', '');
                        node.setAttribute('loading', 'lazy');
                        node.removeAttribute('onerror'); // usuwa JS
                    }
                }
            }

            // Rekurencyjnie czyścimy dzieci
            Array.from(node.childNodes).forEach(clean);
        }

        Array.from(temp.childNodes).forEach(clean);
        return temp.innerHTML;
    }


    window.deleteEntry = async (id) => {
        if (!confirm("Usunąć wpis?")) return;
        await deleteDoc(doc(db, "guestbook", id));
    };

    function renderEntry(id, d) {
        const user = auth.currentUser;
        const canEdit = user && (user.uid === d.uid || user.isAdmin);

        return `
        <div class="entry" style="border-bottom:1px dotted #888; margin-bottom:10px; padding:5px;">
            <strong>${d.name}</strong>
            <small style="color:#666">(${formatDate(d.createdAt)})</small>
            <p style="margin-top:5px;">${sanitizeHtml(d.content)}</p>
            ${canEdit ? `<button onclick="deleteEntry('${id}')">Usuń</button>` : ""}
        </div>`;
    }

    const list = document.getElementById('entries-list');
    const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"));

    onSnapshot(q, (snap) => {
        list.innerHTML = "";
        snap.forEach(doc => {
            const d = doc.data();
            list.innerHTML += renderEntry(doc.id, d);
        });
    });

    const form = document.getElementById('guestbook-form');
    form.onsubmit = async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            alert("Musisz być zalogowany.");
            return;
        }

        const content = document.getElementById('guest-content').value.trim();
        if (content.length < 3) return;

        try {
            await addDoc(collection(db, "guestbook"), {
                uid: user.uid,
                name: user.displayName || "Anon",
                content,
                createdAt: serverTimestamp(),
                edited: false
            });

            form.reset();
        } catch (err) {
            console.error(err);
            alert("Błąd podczas dodawania. Sprawdź limity znaków.");
        }
    };


    loadEntries();