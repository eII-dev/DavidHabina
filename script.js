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

    // --- 4. DYNAMICKÉ NAČÍTAVANIE BLOGOV Z data/blog.json (Najnovší vľavo) ---
    const blogGrid = document.getElementById("blog-grid");
    
    if (blogGrid) {
        fetch('data/blog.json')
            .then(response => response.json())
            .then(data => {
                const rawItems = data.items || [];
                
                // Mapovanie a otočenie poradia, aby najnovší pridaný článok bol vľavo
                const blogPosts = rawItems.map(item => ({
                    title: item.title_sk || item.title || "",
                    date: item.date || "",
                    image: item.image || "",
                    summary: item.desc_sk || item.desc || "",
                    content: item.content_sk || item.content || ""
                })).reverse();

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

                // Kliknutie na "Čítať viac" (Otvorenie modalu)
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

        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTl.from(".hero-title", { duration: 1.2, y: 40, opacity: 0, delay: 0.2 })
              .from(".hero-subtitle", { duration: 1.2, y: 30, opacity: 0 }, "-=0.8")
              .from(".scroll-down", { duration: 1, opacity: 0 }, "-=0.6");

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
