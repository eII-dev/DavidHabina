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

    // --- 4. BLOG MODAL ---
    window.closeBlogModal = function() {
        const modal = document.getElementById("blog-modal");
        if (modal) modal.classList.remove("active");
    };

    // --- 5. GSAP ELEGANTNÉ ANIMÁCIE ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Úvodná animácia Hero sekcie pri načítaní stránky
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTl.from(".hero-title", { duration: 1.2, y: 40, opacity: 0, delay: 0.2 })
              .from(".hero-subtitle", { duration: 1.2, y: 30, opacity: 0 }, "-=0.8")
              .from(".scroll-down", { duration: 1, opacity: 0 }, "-=0.6");

        // Elegantné vynáranie nadpisov sekcií pri scrollovaní
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

        // Postupné (stagger) vynáranie boxov so službami
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

        // Vynáranie obsahu v sekcii "O mne"
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

        // Postupné vysúvanie FAQ otázok
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

        // Plynulé sčítavanie štatistík pri prechode zrakom
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
