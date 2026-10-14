
                import { db } from './assets/firebase.js';
                import { collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

                let currentIndex = 0;
                let entries = [];

                async function loadEntries() {
                    const container = document.getElementById('carousel-container');
                    const navContainer = document.getElementById('carousel-nav');
                    
                    try {
                        const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"), limit(5));
                        const querySnapshot = await getDocs(q);
                        
                        if (querySnapshot.empty) {
                            container.innerHTML = '<p style="text-align:center; color:#999;">Brak wpisów. Bądź pierwszy!</p>';
                            return;
                        }

                        entries = querySnapshot.docs.map(doc => doc.data());

                        // Create carousel entries
                        entries.forEach((data, index) => {
                            const date = data.createdAt?.toDate().toLocaleDateString('pl-PL') || "Niedawno";
                            const authorName = data.nick || data.name || "Anonimowy Lechita";
                            const content = data.content.substring(0, 60) + (data.content.length > 60 ? '...' : '');
                            
                            const entryEl = document.createElement('div');
                            entryEl.className = 'carousel-entry' + (index === 0 ? ' active' : '');
                            entryEl.innerHTML = `
                                <hr style="margin: 5px 0;">
                                <p><strong>${authorName}</strong></p>
                                <p style="font-style: italic;">"${content}"</p>
                                <p class="entry-time">${date}</p>
                            `;
                            container.appendChild(entryEl);
                        });

                        // Create navigation dots
                        if (entries.length > 1) {
                            entries.forEach((_, index) => {
                                const dot = document.createElement('div');
                                dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
                                dot.onclick = () => goToSlide(index);
                                navContainer.appendChild(dot);
                            });

                            // Auto-rotate every 5 seconds
                            setInterval(() => {
                                currentIndex = (currentIndex + 1) % entries.length;
                                updateCarousel();
                            }, 5000);
                        }
                    } catch (e) {
                        container.innerHTML = '<p style="color:#d00;">Błąd ładowania</p>';
                        console.error(e);
                    }
                }

                function updateCarousel() {
                    const entryEls = document.querySelectorAll('.carousel-entry');
                    const dots = document.querySelectorAll('.carousel-dot');
                    
                    entryEls.forEach((el, index) => {
                        el.classList.toggle('active', index === currentIndex);
                    });
                    dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === currentIndex);
                    });
                }

                function goToSlide(index) {
                    currentIndex = index;
                    updateCarousel();
                }

                loadEntries();