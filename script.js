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

// --- CENTRÁLNA LOGIKA PRE MENU A PREKLIKY ---
const hamburgerToggle = document.getElementById('hamburger-toggle');
const navLinks = document.getElementById('nav-links');
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
                        duration: 0.8,
                        ease: "power2.inOut"
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

// --- ELEGANTNÉ GSAP ANIMÁCIE ---
function initGSAPAnimations(elements) {
    elements.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 30 },
            {
                opacity: 1, 
                y: 0, 
                duration: 0.5, 
                ease: "power2.out", 
                scrollTrigger: {
                    trigger: el,
                    scroller: scrollWrapper,
                    start: "top 95%", 
                }
            }
        );
    });
}

// --- JAZYKOVÉ NASTAVENIE ---
let globalBlogItems = [];

function setLanguage(lang) {
    const body = document.body;
    const btnSk = document.getElementById('lang-sk-btn');
    const btnEn = document.getElementById('lang-en-btn');

    if (lang === 'en') {
        body.classList.remove('lang-sk');
        body.classList.add('lang-en');
        btnSk?.classList.remove('active-lang');
        btnEn?.classList.add('active-lang');
        localStorage.setItem('selectedLang', 'en');
    } else {
        body.classList.remove('lang-en');
        body.classList.add('lang-sk');
        btnEn?.classList.remove('active-lang');
        btnSk?.classList.add('active-lang');
        localStorage.setItem('selectedLang', 'sk');
    }
}

// --- BLOG LOGIKA ---
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
        
        article.innerHTML = `
            <div class="blog-info">
                <span class="blog-date">${item.date || ''}</span>
                <h3>
                    <span class="lang-sk">${item.title_sk || item.title || ''}</span>
                    <span class="lang-en">${item.title_en || item.title || ''}</span>
                </h3>
                <p>
                    <span class="lang-sk">${item.desc_sk || item.description || ''}</span>
                    <span class="lang-en">${item.desc_en || item.description || ''}</span>
                </p>
                <button onclick="openBlogModal(${index})" class="read-more-btn">
                    <span class="lang-sk">Čítať viac</span>
                    <span class="lang-en">Read more</span> 
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
    
    document.getElementById('modal-title-sk').innerText = item.title_sk || item.title || '';
    document.getElementById('modal-title-en').innerText = item.title_en || item.title || '';
    document.getElementById('modal-date').innerText = item.date || '';
    
    const parseContent = (text) => {
        if (!text) return '';
        return typeof marked !== 'undefined' ? marked.parse(text) : text.replace(/\n/g, '<br>');
    };

    document.getElementById('modal-content-sk').innerHTML = parseContent(item.content_sk || item.body || item.desc_sk);
    document.getElementById('modal-content-en').innerHTML = parseContent(item.content_en || item.body || item.desc_en);
    
    document.getElementById('blog-modal').classList.add('active');
    document.body.style.setProperty('overflow-y', 'hidden', 'important'); 
}

function closeBlogModal() {
    const modal = document.getElementById('blog-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.setProperty('overflow-y', 'auto', 'important'); 
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBlogModal();
});

// --- INICIALIZÁCIA STRÁNKY ---
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang') || 'sk';
    setLanguage(savedLang);
    loadBlogPosts();
    
    setTimeout(() => {
        initGSAPAnimations(document.querySelectorAll('[data-aos]'));
        ScrollTrigger.refresh();
    }, 100);

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
                const isEn = document.body.classList.contains('lang-en');
                if (isEn) {
                    formStatus.style.color = '#28a745';
                    formStatus.innerText = 'Thank you! Your message has been sent successfully.';
                } else {
                    formStatus.style.color = '#28a745';
                    formStatus.innerText = 'Ďakujem! Vaša správa bola úspešne odoslaná.';
                }
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
