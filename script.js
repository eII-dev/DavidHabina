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

    // --- 4. BLOG DATA & RENDERING (Najnovší článok je prvý -> zobrazený vľavo) ---
    const blogPosts = [
        {
            title: "Ako nestratiť peniaze v roku 2026 💵🔎",
            date: "15.SEPTEMBER 2026",
            image: "/images/714e6904-f562-38dd-9522-f1de3447647a.jpg",
            summary: "Rast cien je realita, ktorej sa nevyhne nikto z nás. Pozri sa, ako ovplyvňuje tvoje financie a prečo dáva zmysel nechať peniaze pracovať.",
            content: `# **ČO ROBÍ INFLÁCIA S ÚSPORAMI ?**\n\nInflácia potichu ukrajuje z hodnoty peňazí. Ak necháš úspory len ležať na účte alebo doma „pod vankúšom“, síce sa **ich suma nemení, ale to, čo si za ne kúpiš, áno — a smerom nadol.**\n\nPredstav si jednoduchý príklad:\nDnes spravíš veľký nákup potravín za 100 €.\nAk budú ceny o rok vyššie **o 5 %, ten istý nákup ťa bude stáť približne 105 €.**\n\nTvojich 100 € nezmizlo ale ich kúpna sila áno.\n\nA práve preto dlhodobo **neinvestované peniaze znamenajú tichú, ale reálnu stratu.**\n\n![](/images/8d9233ce-de39-0bc7-672f-0a1b0fb0dc69.jpg)\n\n**ODPORÚČANIE**\n\n**Úprava trvalého príkazu na existujúcich investičných zmluvách.** Variabilný symbol aj IBAN zostávajú nezmenené. **Ak využívaš investície a chcel by si sa na to pozrieť alebo ak ešte neivestuješ a preferuješ sa dozvedieť viac informácií, neváhaj ma kontaktovať.**\n\n**PRÍKLADY PLATIEB**\n\n**35 € / mesačne**\n+ 4,2 % = **36,48 €**\n\n**50 € / mesačne**\n+ 4,2 % = **52,10 €**\n\n**75 € / mesačne**\n+ 4,2 % = **78,15 €**\n\n**100 € / mesačne**\n+ 4,2 % = **104,20 €**\n\n![](/images/1b1666f9-0e3a-3b63-7eb3-584ecc40f350.jpg)\n\n**PREČO NAVÝŠIŤ INVESTÍCIU ?**\n\n**Ochrana reálnej hodnoty Tvojich investícií:** Tvoja investícia bude držať krok s infláciou.\n \n\n**Vyššia konečná suma:** Zvýšením príspevkov dosiahneš vyššiu celkovú investovanú sumu.\n\nChráň svoje investície pred infláciou a zabezpeč ich rast aj v súčasnom ekonomickom prostredí.\n\nPríklad investície **3000 eur/jednorázovo na začiatku + 100 eur/mesačne po dobu 20 rokov** pri priemernom zhodnotení **8.39 % ročne:** čistý zisk v čase = **47 000 eur**\n\n\n![](/images/38e85202-757d-2bfb-0b92-d35754e702f5.png)\n\nPríklad **konzervatívnejšej investície 50 000 eur jednorázovo po dobu 5 rokov** pri priemernom zhodnotení **4.25 % ročne:** čistý zisk v čase = **11 500 eur**\n\n![](/images/094817fa-2b29-dc08-02b7-bab421a4a6b7.png)`
        },
        {
            title: "Ako si dohodnúť najnižší úrok na hypotéke?",
            date: "4. SEPTEMBER 2026",
            image: "",
            summary: "Prehľad kľúčových faktorov, ktoré rozhodujú o podmienkach pri financovaní bývania...",
            content: "Získanie najlepšieho úroku na hypotéke nie je len o šťastí, ale o dôkladnej príprave.\n\n### 1. Porovnajte celý trh\nBanka vám vždy ponúkne len svoje vlastné produkty. Ak však porovnáte ponuky všetkých bánk na trhu, dokážete ušetriť desiatky tisíc eur na úrokoch.\n\n### 2. Príprava úverového registra\nPred žiadosťou o hypotéku je dôležité mať čistý úverový register a správne nastavené existujúce záväzky.\n\nObráťte sa na mňa a všetko vybavím za vás bez zbytočného stresu."
        },
        {
            title: "Investovanie pre začiatočníkov: Kde začať?",
            date: "28. AUGUST 2026",
            image: "",
            summary: "Základné pravidlá pre budovanie finančnej rezervy a dlhodobého majetku bez rizika...",
            content: "Mnoho ľudí sa obáva investovania kvôli riziku. Pri správne nastavenej stratégii je však investovanie najlepším nástrojom na ochranu peňazí pred infláciou.\n\n### Základné pravidlá:\n1. Vytvorte si najprv núdzovú rezervu (3 až 6-násobok mesačných výdavkov).\n2. Investujte pravidelne a dlhodobo.\n3. Diverzifikujte svoje portfolio."
        }
    ];

    const blogGrid = document.getElementById("blog-grid");
    if (blogGrid) {
        blogGrid.innerHTML = "";
        blogPosts.forEach((post, index) => {
            const card = document.createElement("div");
            card.className = "blog-card";
            
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
