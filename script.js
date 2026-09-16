document.addEventListener("DOMContentLoaded", () => {
    // --- 1. MOBILNÉ MENU (Hamburger) ---
    const hamburgerToggle = document.getElementById("hamburger-toggle");
    const navLinksMobile = document.getElementById("nav-links-mobile");
    const hamburgerIcon = document.getElementById("hamburger-icon");

    if (hamburgerToggle && navLinksMobile) {
        hamburgerToggle.addEventListener("click", () => {
            navLinksMobile.classList.toggle("active");
            if (navLinksMobile.classList.contains("active")) {
                hamburgerIcon.classList.remove("fa-bars");
                hamburgerIcon.classList.add("fa-xmark");
            } else {
                hamburgerIcon.classList.remove("fa-xmark");
                hamburgerIcon.classList.add("fa-bars");
            }
        });

        // Zatvorenie menu po kliknutí na akýkoľvek odkaz
        navLinksMobile.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinksMobile.classList.remove("active");
                hamburgerIcon.classList.remove("fa-xmark");
                hamburgerIcon.classList.add("fa-bars");
            });
        });
    }

    // --- 2. GDPR MODAL ---
    window.openGdprModal = function(event) {
        if (event) event.preventDefault();
        const modal = document.getElementById("gdpr-modal");
        if (modal) modal.classList.add("active");
    };

    window.closeGdprModal = function() {
        const modal = document.getElementById("gdpr-modal");
        if (modal) modal.classList.remove("active");
    };

    // --- 3. COOKIE BANNER ---
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptCookiesBtn = document.getElementById("accept-cookies");
    const declineCookiesBtn = document.getElementById("decline-cookies");

    if (cookieBanner) {
        if (!localStorage.getItem("cookieConsent")) {
            setTimeout(() => {
                cookieBanner.classList.add("show");
            }, 1000);
        }

        if (acceptCookiesBtn) {
            acceptCookiesBtn.addEventListener("click", () => {
                localStorage.setItem("cookieConsent", "all");
                cookieBanner.classList.remove("show");
            });
        }

        if (declineCookiesBtn) {
            declineCookiesBtn.addEventListener("click", () => {
                localStorage.setItem("cookieConsent", "necessary");
                cookieBanner.classList.remove("show");
            });
        }
    }

    // --- 4. BLOG DATA & RENDERING (2x bez obrázka, 1x s obrázkom z Decap CMS) ---
    const blogPosts = [
        {
            title: "Ako si správne nastaviť hypotéku v roku 2026",
            date: "12. FEBRUÁR 2026",
            image: "", // Bez obrázka
            summary: "Úrokové sadzby prechádzajú zmenami. Pozrite sa na kľúčové kroky, ako získať najvýhodnejšie financovanie pre vaše nové bývanie bez zbytočných preplatkov.",
            content: "Svet hypoték prináša každoročne nové výzvy. Pri výbere banky sa neoplatí pozerať len na samotný úrok, ale aj na poplatky, podmienky predčasného splatenia či povinné poistenie.\n\n### Na čo si dať pozor?\n1. Fixácia úrokovej sadzby.\n2. LTV (výška úveru vzhľadom k hodnote nehnuteľnosti).\n3. Možnosti mimoriadnych splátok bez sankcií.\n\nAk chcete ušetriť tisíce eur, oplatí sa preveriť ponuky viacerých bánk naraz, s čím vám ako nezávislý sprostredkovateľ rád pomôžem."
        },
        {
            title: "Investovanie pre začiatočníkov: Ako ochrániť peniaze pred infláciou",
            date: "28. JANUÁR 2026",
            image: "", // Bez obrázka
            summary: "Nechať peniaze na bežnom účte sa dnes neoplatí. Zistite, ako fungujú podielové fondy a prečo je pravidelné sporenie kľúčom k finančnej nezávislosti.",
            content: "Inflácia ukrajuje z úspor každého z nás. Jediným spôsobom, ako peniaze dlhodobo zhodnotiť, je rozumné investovanie do overených aktív.\n\n### Základné pravidlá investovania:\n- **Čas je váš najlepší priateľ** (sila zloženého úrokovania).\n- **Diverzifikácia portfólia** (nedávajte všetky vajíčka do jedného košíka).\n- **Pravidelnosť a disciplína** (vyhátnuť sa panike pri výkyvoch trhu)."
        },
        {
            title: "Prehľad noviniek a úspešných realizácií v Košiciach",
            date: "15. FEBRUÁR 2026",
            image: "davidko.webp", // S obrázkom (spravované cez Decap CMS)
            summary: "Pozrite si fotogalériu a zhrnutie úspešne vybavených financovaní a moderných stretnutí s klientmi v Business Center Rozvojová.",
            content: "Za posledné obdobie sa nám podarilo pomôcť desiatkam klientov v Košiciach a okolí s financovaním bývania a investícií.\n\nTeší ma dôvera, ktorú mi prejavujete. Všetky osobné stretnutia prebiehajú v príjemnom a profesionálnom prostredí Business Center Rozvojová."
        }
    ];

    const blogGrid = document.getElementById("blog-grid");
    if (blogGrid) {
        blogGrid.innerHTML = "";
        blogPosts.forEach((post, index) => {
            const card = document.createElement("div");
            card.className = "blog-card";
            
            // Vykreslí obal s obrázkom iba vtedy, ak obrázok v poli existuje
            const imageWrapperHtml = post.image 
                ? `<div class="blog-image-wrapper"><img src="${post.image}" alt="${post.title}" loading="lazy"></div>` 
                : '';

            card.innerHTML = `
                ${imageWrapperHtml}
                <div>
                    <span class="blog-date">${post.date}</span>
                    <h3>${post.title}</h3>
                    <p>${post.summary}</p>
                </div>
                <button class="read-more-btn" data-index="${index}">Čítať viac <i class="fa-solid fa-arrow-right"></i></button>
            `;
            blogGrid.appendChild(card);
        });

        // Kliknutie na "Čítať viac"
        blogGrid.addEventListener("click", (e) => {
            const btn = e.target.closest(".read-more-btn");
            if (btn) {
                const index = btn.getAttribute("data-index");
                const post = blogPosts[index];
                if (post) {
                    document.getElementById("modal-title").innerText = post.title;
                    document.getElementById("modal-date").innerText = post.date;
                    
                    const contentDiv = document.getElementById("modal-content");
                    let fullHtml = "";
                    if (post.image) {
                        fullHtml += `<img src="${post.image}" alt="${post.title}" style="width:100%; border-radius:4px; margin-bottom:20px;">`;
                    }
                    if (typeof marked !== 'undefined') {
                        fullHtml += marked.parse(post.content);
                    } else {
                        fullHtml += `<p>${post.content.replace(/\n/g, '<br>')}</p>`;
                    }
                    contentDiv.innerHTML = fullHtml;

                    document.getElementById("blog-modal").classList.add("active");
                }
            }
        });
    }

    // Zatvorenie blog modalu
    window.closeBlogModal = function() {
        const modal = document.getElementById("blog-modal");
        if (modal) modal.classList.remove("active");
    };

    // Šípky na posúvanie blogu
    const scrollLeftBtn = document.getElementById("scroll-left-btn");
    const scrollRightBtn = document.getElementById("scroll-right-btn");
    if (blogGrid && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener("click", () => {
            blogGrid.scrollBy({ left: -390, behavior: 'smooth' });
        });
        scrollRightBtn.addEventListener("click", () => {
            blogGrid.scrollBy({ left: 390, behavior: 'smooth' });
        });
    }

    // --- 5. GSAP ELEGANTNÉ ANIMÁCIE ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Úvodná animácia Hero sekcie pri načítaní stránky
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTl.from(".hero-title", { duration: 1.2, y: 40, opacity: 0, delay: 0.2 })
              .from(".hero-subtitle", { duration: 1.2, y: 30, opacity: 0 }, "-=0.8")
              .from(".scroll-down", { duration: 1, opacity: 0 }, "-=0.6");

        // Elegantné vynáranie nadpisov sekcií
        gsap.utils.toArray(".section-header").forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                duration: 1,
                y: 30,
                opacity: 0,
                ease: "power2.out"
            });
        });

        // Postupné vynáranie služieb
        gsap.from(".service-box", {
            scrollTrigger: {
                trigger: ".services-grid",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            duration: 0.8,
            y: 40,
            opacity: 0,
            stagger: 0.15,
            ease: "power2.out"
        });

        // Vynáranie obsahu "O mne"
        gsap.from(".about-text > *", {
            scrollTrigger: {
                trigger: "#omne",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: "power2.out"
        });

        // FAQ položky
        gsap.from(".faq-item", {
            scrollTrigger: {
                trigger: ".faq-list",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            duration: 0.6,
            x: -30,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out"
        });

        // Živé sčítavanie štatistík
        const stats = document.querySelectorAll(".stat-number");
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute("data-target"));
            if (!isNaN(target)) {
                ScrollTrigger.create({
                    trigger: stat,
                    start: "top 85%",
                    once: true,
                    onEnter: () => {
                        let count = { val: 0 };
                        gsap.to(count, {
                            val: target,
                            duration: 2,
                            ease: "power1.out",
                            onUpdate: () => {
                                stat.innerText = Math.floor(count.val);
                            }
                        });
                    }
                });
            }
        });
    }
});
