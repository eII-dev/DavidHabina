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

    // --- 0B. JEMNÝ & UHLADENÝ 3D POHYB KARIET A 3D OBJEKTOV ---
    if (window.innerWidth > 900) {
        const cards3d = document.querySelectorAll(".bento-3d");
        cards3d.forEach(card => {
            const obj3d = card.querySelector(".bento-3d-object");

            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const normX = ((e.clientX - rect.left) / rect.width) - 0.5;
                const normY = ((e.clientY - rect.top) / rect.height) - 0.5;

                const rotateY = normX * 2.2;
                const rotateX = -normY * 2.2;

                card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;

                if (obj3d) {
                    const moveX = normX * -7;
                    const moveY = normY * -7;
                    obj3d.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0)`;
                }
            }, { passive: true });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)";
                if (obj3d) {
                    obj3d.style.transform = "translate3d(0px, 0px, 0px)";
                }
            });
        });
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

    // --- 4B. INTERAKTÍVNY PREPÍNAČ KARIÉRNYCH CIEST ---
    const pathTabs = document.querySelectorAll(".cr-tab-btn");
    const pathDisplay = document.getElementById("cr-path-display");

    if (pathTabs.length > 0 && pathDisplay) {
        const pathData = {
            novacik: {
                label: "Začínam od nuly",
                badge: "Ideálne pre nováčikov",
                title: "Naučím ťa remeslo od úplných základov",
                desc: "Nepotrebuješ ekonomickú školu ani predchádzajúcu prax. Dôležitá je chuť učiť sa, komunikovať s ľuďmi a budovať si vlastnú značku.",
                perks: [
                    "Kompletné zaškolenie v praxi",
                    "Príprava na licenciu NBS",
                    "Spoločné prvé stretnutia"
                ]
            },
            prax: {
                label: "Mám prax z obchodu / banky",
                badge: "Pre skúsených obchodníkov a bankárov",
                title: "Posuň svoju kariéru bez zbytočných obmedzení",
                desc: "Ak už máš skúsenosti z banky, poisťovne alebo obchodu, získaš prístup k riešeniam celého trhu, silnú analytickú podporu a priestor rásť.",
                perks: [
                    "Rýchly prechod bez byrokracie",
                    "Celý finančný trh pod jednou strechou",
                    "Možnosť vybudovať vlastný tím"
                ]
            },
            popri: {
                label: "Popri VŠ alebo práci",
                badge: "Flexibilný štart vlastným tempom",
                title: "Otestuj si biznis popri škole alebo zamestnaní",
                desc: "Začni postupne, naber prax na reálnych prípadoch a keď uvidíš prvé výsledky, plynulo prejdeš na plnohodnotné podnikanie.",
                perks: [
                    "Časový harmonogram podľa teba",
                    "Žiadny tlak na okamžitú výpoveď",
                    "Praktická finančná gramotnosť"
                ]
            }
        };

        const badgeEl = document.getElementById("cr-path-badge");
        const titleEl = document.getElementById("cr-path-title");
        const descEl = document.getElementById("cr-path-desc");
        const perksEl = document.getElementById("cr-path-perks");
        const pathInput = document.getElementById("career-path-input");

        pathTabs.forEach(btn => {
            btn.addEventListener("click", () => {
                const key = btn.getAttribute("data-path");
                const info = pathData[key];
                if (!info || btn.classList.contains("active")) return;

                pathTabs.forEach(t => {
                    t.classList.remove("active");
                    t.setAttribute("aria-selected", "false");
                });
                btn.classList.add("active");
                btn.setAttribute("aria-selected", "true");

                pathDisplay.classList.add("switching");
                setTimeout(() => {
                    if (badgeEl) badgeEl.textContent = info.badge;
                    if (titleEl) titleEl.textContent = info.title;
                    if (descEl) descEl.textContent = info.desc;
                    if (perksEl) {
                        perksEl.innerHTML = info.perks
                            .map(p => `<span><i class="fa-solid fa-check"></i> ${p}</span>`)
                            .join("");
                    }
                    if (pathInput) pathInput.value = info.label;
                    pathDisplay.classList.remove("switching");
                }, 150);
            });
        });
    }

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
                    card.className = "blog-card";

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

            const duration = 1600;
            const delay = index * 140;

            setTimeout(() => {
                const startTime = performance.now();
                const updateNumber = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easedProgress = 1 - Math.pow(1 - progress, 4);
                    stat.innerText = Math.round(easedProgress * target);

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
            }, { threshold: 0.2 });

            observer.observe(statsSection);
        } else {
            animateStats();
        }
    }

    // --- 8. GSAP ANIMÁCIE SEKCÍ ---
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

        if (document.querySelector(".cr-title")) {
            gsap.from(".cr-hero-inner > *", {
                duration: 0.75,
                y: 18,
                opacity: 0,
                stagger: 0.08,
                delay: 0.05,
                ease: "power3.out"
            });
        }

        gsap.utils.toArray(".bento-about-mosaic, .bento-services-asymmetric, .cr-bento-showcase").forEach(grid => {
            gsap.from(grid.children, {
                scrollTrigger: {
                    trigger: grid,
                    start: "top 84%",
                    toggleActions: "play none none none"
                },
                duration: 0.7,
                y: 20,
                opacity: 0,
                stagger: 0.09,
                ease: "power2.out"
            });
        });
    }
});
