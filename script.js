document.addEventListener("DOMContentLoaded", () => {
    // --- 0. FULL-WIDTH NAVBAR SCROLL EFEKT ---
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

    // --- 0B. ELEGANTNÉ PODSVIETENIE KARIET PRI PRECHODE MYŠOU ---
    if (window.innerWidth > 900) {
        document.addEventListener("mousemove", (e) => {
            const card = e.target.closest(".hover-glow, .hover-glow-dark");
            if (card) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            }
        }, { passive: true });
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

    // --- 2. FULL-SCREEN GDPR READER ---
    const gdprModal = document.getElementById("gdpr-modal");

    window.openGdprModal = function(event) {
        if (event) event.preventDefault();
        if (gdprModal) {
            gdprModal.scrollTop = 0;
            gdprModal.classList.add("active");
            document.body.classList.add("reader-open");
        }
    };

    window.closeGdprModal = function() {
        if (gdprModal) {
            gdprModal.classList.remove("active");
            document.body.classList.remove("reader-open");
        }
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

    // --- 5. ČLÁNKY + FULL-SCREEN READER SO SMARAGDOVOU PROGRESS LIŠTOU ---
    const blogGrid = document.getElementById("blog-grid");
    const blogModal = document.getElementById("blog-modal");
    const articleProgressBar = document.getElementById("article-progress-bar");

    const updateArticleProgress = () => {
        if (!blogModal || !articleProgressBar) return;
        const scrollTop = blogModal.scrollTop;
        const maxScroll = blogModal.scrollHeight - blogModal.clientHeight;
        if (maxScroll <= 0) {
            articleProgressBar.style.width = "100%";
            return;
        }
        const percent = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
        articleProgressBar.style.width = `${percent}%`;
    };

    if (blogModal) {
        let ticking = false;
        blogModal.addEventListener("scroll", () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateArticleProgress();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        window.addEventListener("resize", () => {
            if (blogModal.classList.contains("active")) {
                updateArticleProgress();
            }
        }, { passive: true });
    }

    if (blogGrid) {
        fetch('data/blog.json')
            .then(response => response.json())
            .then(data => {
                const rawItems = data.items || [];
                
                const blogPosts = rawItems.map(item => ({
                    title: item.title_sk || item.title || "",
                    date: item.date || "",
                    summary: item.desc_sk || item.desc || "",
                    content: item.content_sk || item.content || ""
                })).reverse();

                blogGrid.innerHTML = "";
                blogPosts.forEach((post, index) => {
                    const card = document.createElement("article");
                    card.className = "blog-card hover-glow";

                    card.innerHTML = `
                        <div>
                            <div class="blog-card-meta">
                                <span class="blog-date">${post.date}</span>
                            </div>
                            <h3>${post.title}</h3>
                            <p>${post.summary}</p>
                        </div>
                        <div class="blog-card-footer">
                            <button type="button" class="read-more-btn" data-index="${index}">
                                <span>Čítať článok</span>
                                <span class="read-more-arrow"><i class="fa-solid fa-arrow-right"></i></span>
                            </button>
                        </div>
                    `;
                    blogGrid.appendChild(card);
                });

                blogGrid.addEventListener("click", (e) => {
                    const cardEl = e.target.closest(".blog-card");
                    if (cardEl && blogModal) {
                        const btn = cardEl.querySelector(".read-more-btn");
                        const index = btn ? btn.getAttribute("data-index") : null;
                        const post = index !== null ? blogPosts[index] : null;
                        if (post) {
                            document.getElementById("modal-title").innerText = post.title;
                            document.getElementById("modal-date").innerText = post.date;

                            const contentDiv = document.getElementById("modal-content");
                            if (typeof marked !== 'undefined') {
                                contentDiv.innerHTML = marked.parse(post.content);
                            } else {
                                contentDiv.innerHTML = `<p>${post.content.replace(/\n/g, '<br>')}</p>`;
                            }

                            contentDiv.querySelectorAll("img").forEach(img => {
                                img.setAttribute("loading", "lazy");
                                img.addEventListener("load", updateArticleProgress, { once: true });
                            });

                            blogModal.scrollTop = 0;
                            if (articleProgressBar) articleProgressBar.style.width = "0%";
                            blogModal.classList.add("active");
                            document.body.classList.add("reader-open");

                            requestAnimationFrame(updateArticleProgress);
                        }
                    }
                });
            })
            .catch(error => {
                console.error("Chyba pri načítavaní data/blog.json:", error);
            });
    }

    window.closeBlogModal = function() {
        if (blogModal) {
            blogModal.classList.remove("active");
            document.body.classList.remove("reader-open");
            if (articleProgressBar) articleProgressBar.style.width = "0%";
        }
    };

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            window.closeBlogModal();
            window.closeGdprModal();
        }
    });

    const scrollLeftBtn = document.getElementById("scroll-left-btn");
    const scrollRightBtn = document.getElementById("scroll-right-btn");
    if (blogGrid && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener("click", () => {
            blogGrid.scrollBy({ left: -388, behavior: 'smooth' });
        });
        scrollRightBtn.addEventListener("click", () => {
            blogGrid.scrollBy({ left: 388, behavior: 'smooth' });
        });
    }

    // --- 6. ODOSLANIE FORMULÁROV (HLAVNÝ KONTAKT AJ KARIÉRA) ---
    const setupNetlifyForm = (formId, statusId, btnId, successTitle, successSubtitle) => {
        const formEl = document.getElementById(formId);
        const statusEl = document.getElementById(statusId);
        const btnEl = document.getElementById(btnId);

        if (!formEl || !statusEl) return;

        formEl.addEventListener("submit", async (e) => {
            e.preventDefault();

            const originalBtnHtml = btnEl ? btnEl.innerHTML : "";
            if (btnEl) {
                btnEl.disabled = true;
                btnEl.innerHTML = `<span>Odosielam...</span><i class="fa-solid fa-spinner fa-spin"></i>`;
            }

            statusEl.innerHTML = "";

            try {
                const formData = new FormData(formEl);
                const encodedData = new URLSearchParams(formData).toString();
                const targetUrl = formEl.getAttribute("action") || "/";

                const response = await fetch(targetUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: encodedData
                });

                if (response.ok) {
                    formEl.reset();
                    statusEl.innerHTML = `
                        <div class="form-feedback success">
                            <i class="fa-solid fa-circle-check"></i>
                            <div>
                                <strong>${successTitle}</strong>
                                <span>${successSubtitle}</span>
                            </div>
                        </div>
                    `;
                } else {
                    throw new Error("Chyba servera");
                }
            } catch (err) {
                statusEl.innerHTML = `
                    <div class="form-feedback error">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <div>
                            <strong>Správu sa momentálne nepodarilo odoslať.</strong>
                            <span>Skúste to prosím znova alebo mi napíšte priamo na davidhabina@prosight.sk.</span>
                        </div>
                    </div>
                `;
            } finally {
                if (btnEl) {
                    btnEl.disabled = false;
                    btnEl.innerHTML = originalBtnHtml;
                }
            }
        });
    };

    setupNetlifyForm(
        "contact-form",
        "form-status",
        "submit-btn",
        "Správa bola úspešne odoslaná.",
        "Ďakujem za váš záujem, ozvem sa vám čo najskôr."
    );

    setupNetlifyForm(
        "career-form",
        "career-form-status",
        "career-submit-btn",
        "Záujem o spoluprácu bol odoslaný.",
        "Ďakujem, ozvem sa ti do 24 hodín a dohodneme si nezáväzný rozhovor."
    );

    // --- 7. PLYNULÉ NABIEHANIE ŠTATISTÍK ---
    const statsSection = document.getElementById("statistiky");
    const stats = document.querySelectorAll(".stat-number");
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;
        statsAnimated = true;

        stats.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute("data-target"), 10);
            if (isNaN(target)) return;

            const duration = 1700;
            const delay = index * 140;

            setTimeout(() => {
                const startTime = performance.now();

                const updateNumber = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easedProgress = 1 - Math.pow(1 - progress, 4);
                    const currentVal = Math.round(easedProgress * target);

                    stat.innerText = currentVal;

                    if (progress < 1) {
                        requestAnimationFrame(updateNumber);
                    } else {
                        stat.innerText = target;
                    }
                };

                requestAnimationFrame(updateNumber);
            }, delay);
        });
    };

    if (statsSection && stats.length > 0) {
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateStats();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.25 });

            observer.observe(statsSection);
        } else {
            animateStats();
        }
    }

    // --- 8. GSAP ANIMÁCIE SEKCÍ (Pre Desktop > 900px) ---
    if (window.innerWidth > 900 && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        if (document.querySelector(".hero-title")) {
            const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
            heroTl.from(".hero-eyebrow", { duration: 0.65, y: 12, opacity: 0, delay: 0.08 })
                  .from(".hero-title", { duration: 0.85, y: 22, opacity: 0 }, "-=0.4")
                  .from(".hero-subtitle", { duration: 0.75, y: 16, opacity: 0 }, "-=0.55")
                  .from(".hero-description", { duration: 0.75, y: 14, opacity: 0 }, "-=0.55")
                  .from(".hero-benefits", { duration: 0.7, y: 12, opacity: 0 }, "-=0.5")
                  .from(".hero-actions", { duration: 0.7, y: 12, opacity: 0 }, "-=0.5")
                  .from(".hero-portrait", { duration: 1.05, opacity: 0 }, "-=0.85");
        }

        if (document.querySelector(".career-hero-title")) {
            const careerTl = gsap.timeline({ defaults: { ease: "power3.out" } });
            careerTl.from(".career-hero-copy > *", { duration: 0.75, y: 18, opacity: 0, stagger: 0.09, delay: 0.06 })
                    .from(".career-mentor-card", { duration: 0.85, y: 22, opacity: 0 }, "-=0.55");
        }

        gsap.utils.toArray(".section-header").forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 86%",
                    toggleActions: "play none none none"
                },
                duration: 0.8,
                y: 22,
                opacity: 0,
                ease: "power2.out"
            });
        });

        if (document.querySelector(".about-bento-grid")) {
            gsap.from(".bento-card", {
                scrollTrigger: {
                    trigger: ".about-bento-grid",
                    start: "top 82%",
                    toggleActions: "play none none none"
                },
                duration: 0.75,
                y: 24,
                opacity: 0,
                stagger: 0.1,
                ease: "power2.out"
            });
        }

        if (document.querySelector(".services-grid")) {
            gsap.from(".service-box", {
                scrollTrigger: {
                    trigger: ".services-grid",
                    start: "top 82%",
                    toggleActions: "play none none none"
                },
                duration: 0.75,
                y: 26,
                opacity: 0,
                stagger: 0.1,
                ease: "power2.out"
            });
        }

        if (document.querySelector(".career-pillars-grid")) {
            gsap.from(".career-pillar-card", {
                scrollTrigger: {
                    trigger: ".career-pillars-grid",
                    start: "top 82%",
                    toggleActions: "play none none none"
                },
                duration: 0.75,
                y: 24,
                opacity: 0,
                stagger: 0.1,
                ease: "power2.out"
            });
        }

        if (document.querySelector(".career-profiles-grid")) {
            gsap.from(".career-profile-card", {
                scrollTrigger: {
                    trigger: ".career-profiles-grid",
                    start: "top 82%",
                    toggleActions: "play none none none"
                },
                duration: 0.75,
                y: 24,
                opacity: 0,
                stagger: 0.1,
                ease: "power2.out"
            });
        }

        if (document.querySelector(".career-steps-grid")) {
            gsap.from(".career-step-card", {
                scrollTrigger: {
                    trigger: ".career-steps-grid",
                    start: "top 84%",
                    toggleActions: "play none none none"
                },
                duration: 0.7,
                y: 20,
                opacity: 0,
                stagger: 0.08,
                ease: "power2.out"
            });
        }

        if (document.querySelector(".faq-list")) {
            gsap.from(".faq-item", {
                scrollTrigger: {
                    trigger: ".faq-list",
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                duration: 0.6,
                y: 16,
                opacity: 0,
                stagger: 0.08,
                ease: "power2.out"
            });
        }
    }
});
