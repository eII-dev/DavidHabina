const isMobile = window.innerWidth <= 900;
const scrollWrapper = isMobile ? document.body : window;

// --- GSAP & SCROLLTRIGGER SYNC ---
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({
    scroller: scrollWrapper
});

if (isMobile) {
    document.body.addEventListener('scroll', ScrollTrigger.update);
}

// --- ANIMÁCIA ŠTATISTÍK (COUNTER) ---
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                
                const updateCount = () => {
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 25);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(counter => observer.observe(counter));
}

// --- CENTRÁLNA LOGIKA PRE MENU A PREKLIKY ---
const hamburgerToggle = document.getElementById('hamburger-toggle');
const navLinks = document.getElementById('nav-links-right'); // Na mobile sa spravuje pravé menu, ktoré obsahuje všetky položky
const hamburgerIcon = document.getElementById('hamburger-icon');

function toggleMenu(forceClose = false) {
    if (!navLinks || !hamburgerToggle) return;
    
    const isOpening = !navLinks.classList.contains('active') && !forceClose;

    if (isOpening) {
        navLinks.classList.add('active');
        hamburgerIcon.classList.remove('fa-bars');
        hamburgerIcon.classList.add('fa-xmark');
        document.body.style.setProperty('overflow-y', 'hidden', 'important'); 
    } else {
        navLinks.classList.remove('active');
        hamburgerIcon.classList.remove('fa-xmark');
        hamburgerIcon.classList.add('fa-bars');
        document.body.style.setProperty('overflow-y', 'auto', 'important'); 
    }
}

if (hamburgerToggle) {
    hamburgerToggle.addEventListener('click', () => toggleMenu());
}

// --- PREKLIKY ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); 
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            toggleMenu(true);
            
            setTimeout(() => {
                if (isMobile) {
                    const offsetTop = targetElement.getBoundingClientRect().top + document.body.scrollTop - 80;
                    gsap.to(document.body, {
                        scrollTop: offsetTop,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                } else {
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }, 50); 
        }
    });
});

// --- RÝCHLE A PLYNULÉ GSAP ANIMÁCIE ---
function initGSAPAnimations(elements) {
    elements.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 20 },
            {
                opacity: 1, 
                y: 0, 
                duration: 0.4, 
                ease: "power1.out", 
                scrollTrigger: {
                    trigger: el,
                    scroller: scrollWrapper,
                    start: "top 98%", 
                }
            }
        );
    });
}

// --- BLOG LOGIKA ---
let globalBlogItems = [];

async function loadBlogPosts() {
    try {
        const response = await fetch('data/blog.json');
        const data = await response.json();
        globalBlogItems = data.items || data.articles || [];
        renderBlogPosts();
    } catch (error) {
        console.error('Chyba pri načítavaní blogu:', error);
    }
}

function renderBlogPosts() {
    const container = document.getElementById('blog-grid');
    if (!container) return;
    container.innerHTML = '';

    globalBlogItems.forEach((item, index) => {
        const article = document.createElement('article');
        article.className = 'blog-card';
        article.setAttribute('data-aos', 'true'); 
        
        const title = item.title || item.title_sk || '';
        const desc = item.description || item.desc_sk || '';
        const date = item.date || '';

        article.innerHTML = `
            <div class="blog-info">
                <span class="blog-date">${date}</span>
                <h3>${title}</h3>
                <p>${desc}</p>
                <button onclick="openBlogModal(${index})" class="read-more-btn">
                    <span>Čítať viac</span> 
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        `;
        container.appendChild(article);
    });
    
    initGSAPAnimations(document.querySelectorAll('.blog-card'));
    ScrollTrigger.refresh();
}

function openBlogModal(index) {
    const item = globalBlogItems[index];
    if (!item) return;
    
    document.getElementById('modal-title').innerText = item.title || item.title_sk || '';
    document.getElementById('modal-date').innerText = item.date || '';
    
    const content = item.body || item.content_sk || item.description || '';
    const parseContent = (text) => {
        if (!text) return '';
        return typeof marked !== 'undefined' ? marked.parse(text) : text.replace(/\n/g, '<br>');
    };

    document.getElementById('modal-content').innerHTML = parseContent(content);
    
    document.getElementById('blog-modal').classList.add('active');
    document.body.style.setProperty('overflow-y', 'hidden', 'important'); 
}

function closeBlogModal() {
    const modal = document.getElementById('blog-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.setProperty('overflow-y', 'auto', 'important'); 
}

// --- GDPR MODAL LOGIKA ---
function openGdprModal(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('gdpr-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.setProperty('overflow-y', 'hidden', 'important');
    }
}

function closeGdprModal() {
    const modal = document.getElementById('gdpr-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.setProperty('overflow-y', 'auto', 'important');
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBlogModal();
        closeGdprModal();
    }
});

// --- INICIALIZÁCIA STRÁNKY ---
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    initCounters(); 
    
    setTimeout(() => {
        initGSAPAnimations(document.querySelectorAll('[data-aos]'));
        ScrollTrigger.refresh();
    }, 50);

    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(contactForm);

            fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                formStatus.style.color = '#28a745';
                formStatus.innerText = 'Ďakujem! Vaša správa bola úspešne odoslaná.';
                contactForm.reset();
            })
            .catch(() => {
                formStatus.style.color = '#dc3545';
                formStatus.innerText = 'Chyba pri odosielaní. Skúste to prosím znova.';
            });
        });
    }
});

// Netlify Identity
if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
        if (!user) {
            window.netlifyIdentity.on("login", () => {
                document.location.href = "/admin/";
            });
        }
    });
}

// --- COOKIE BANNER LOGIKA ---
document.addEventListener('DOMContentLoaded', () => {
    const cookieBanner = document.getElementById('cookie-banner');
    const btnAccept = document.getElementById('accept-cookies');
    const btnDecline = document.getElementById('decline-cookies');

    if (!localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            if (cookieBanner) cookieBanner.classList.add('show');
        }, 1500);
    }

    if (btnAccept) {
        btnAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (btnDecline) {
        btnDecline.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }
});
