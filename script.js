document.addEventListener("DOMContentLoaded", () => {
    // --- 0. APPLE GLASS NAVBAR SCROLL EFEKT ---
    const navbar = document.getElementById("navbar");
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 24) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
    }

    // --- 1. MOBILNÉ MENU (Hamburger) ---
    const hamburgerToggle = document.getElementById("hamburger-toggle");
    const navLinksMobile = document.getElementById("nav-links-mobile");
    const hamburgerIcon = document.getElementById("hamburger-icon");

    if (hamburgerToggle && navLinksMobile) {
        const closeMobileMenu = () => {
            navLinksMobile.classList.remove("active");
            document.body.classList.remove("menu-open");
            if (hamburgerIcon) {
                hamburgerIcon.classList.remove("fa-xmark");
                hamburgerIcon.classList.add("fa-bars");
            }
        };

        hamburgerToggle.addEventListener("click", () => {
            const isActive = navLinksMobile.classList.toggle("active");
            document.body.classList.toggle("menu-open", isActive);
            if (hamburgerIcon) {
                hamburgerIcon.classList.toggle("fa-bars", !isActive);
                hamburgerIcon.classList.toggle("fa-xmark", isActive);
            }
        });

        navLinksMobile.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMobileMenu);
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

    // --- 4. INTERAKTÍVNY FAQ ACCORDION ---
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");
        if (questionBtn) {
            questionBtn.addEventListener("click", () => {
                const isOpen = item.classList.contains("active");
                faqItems.forEach(other => {
                    other.classList.remove("active");
                    const btn = other.querySelector(".faq-question");
                    if (btn) btn.setAttribute("aria-expanded", "false");
                });
                if (!isOpen) {
                    item.classList.add("active");
                    questionBtn.setAttribute("aria-expanded", "true");
                }
            });
        }
    });

    // --- 5. DYNAMICKÉ NAČÍTAVANIE BLOGOV Z data/blog.json (Najnovší vľavo) ---
    const blogGrid = document.getElementById("blog-grid");
    
    if (blogGrid) {
        fetch('data/blog.json')
            .then(response => response.json())
            .then(data => {
                const rawItems = data.items || [];
                
                const blogPosts = rawItems.map(item => ({
                    title: item.title_sk || item.title || "",
                    date: item.date || "",
                    image: item.image || "",
                    summary: item.desc_sk || item.desc || "",
                    content: item.content_sk || item.content || ""
                })).reverse();

                blogGrid.innerHTML = "";
                blogPosts.forEach((post, index) => {
                    const card = document.createElement("article");
                    card.className = "blog-card";
                    
                    const imageWrapperHtml = post.image 
                        ? `<div class="blog-image-wrapper"><img src="${post.image}" alt="${post.title}" loading="lazy"></div>` 
                        : '';

                    card.innerHTML = `
                        <div>
                            ${imageWrapperHtml}
                            <span class="blog-date">${post.date}</span>
                            <h3>${post.title}</h3>
                            <p>${post.summary}</p>
                        </div>
                        <button class="read-more-btn" data-index="${index}">Čítať článok <i class="fa-solid fa-arrow-right"></i></button>
                    `;
                    blogGrid.appendChild(card);
                });

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
                                fullHtml += `<img src="${post.image}" alt="${post.title}">`;
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
            })
            .catch(error => {
                console.error("Chyba pri načítavaní data/blog.json:", error);
            });
    }

    // Zatvorenie blog modalu
    window.closeBlogModal = function() {
        const modal = document.getElementById("blog-modal");
        if (modal) modal.classList.remove("active");
    };

    // Zatvorenie modalov klávesou Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            window.closeBlogModal();
            window.closeGdprModal();
        }
    });

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

    // --- 6. GSAP ANIMÁCIE (Pre Desktop > 900px) ---
    const stats = document.querySelectorAll(".stat-number");
    
    if (window.innerWidth > 900 && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTl.from(".hero-badge", { duration: 0.8, y: 20, opacity: 0, delay: 0.1 })
              .from(".hero-title", { duration: 1, y: 30, opacity: 0 }, "-=0.5")
              .from(".hero-subtitle", { duration: 0.9, y: 22, opacity: 0 }, "-=0.65")
              .from(".hero-description", { duration: 0.9, y: 20, opacity: 0 }, "-=0.65")
              .from(".hero-actions", { duration: 0.8, y: 18, opacity: 0 }, "-=0.6");

        gsap.utils.toArray(".section-header").forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 86%",
                    toggleActions: "play none none none"
                },
                duration: 0.85,
                y: 26,
                opacity: 0,
                ease: "power3.out"
            });
        });

        gsap.from(".bento-card", {
            scrollTrigger: {
                trigger: ".about-bento-grid",
                start: "top 82%",
                toggleActions: "play none none none"
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.12,
            ease: "power3.out"
        });

        gsap.from(".service-box", {
            scrollTrigger: {
                trigger: ".services-grid",
                start: "top 82%",
                toggleActions: "play none none none"
            },
            duration: 0.8,
            y: 32,
            opacity: 0,
            stagger: 0.12,
            ease: "power3.out"
        });

        gsap.from(".faq-item", {
            scrollTrigger: {
                trigger: ".faq-list",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            duration: 0.65,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out"
        });

        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute("data-target"));
            if (!isNaN(target)) {
                ScrollTrigger.create({
                    trigger: stat,
                    start: "top 88%",
                    once: true,
                    onEnter: () => {
                        let count = { val: 0 };
                        gsap.to(count, {
                            val: target,
                            duration: 1.8,
                            ease: "power2.out",
                            onUpdate: () => {
                                stat.innerText = Math.floor(count.val);
                            }
                        });
                    }
                });
            }
        });
    } else {
        // Fallback pre mobil: hneď nastaví reálne čísla štatistík
        stats.forEach(stat => {
            const target = stat.getAttribute("data-target");
            if (target) {
                stat.innerText = target;
            }
        });
    }
});
