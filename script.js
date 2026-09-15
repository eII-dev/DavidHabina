// --- PROSTREDIE PRE MOBILNÝ FIX ---
const isMobile = window.innerWidth <= 900;
const scrollWrapper = isMobile ? document.body : window;

// --- LENIS SMOOTH SCROLL ---
const lenis = new Lenis({
    wrapper: isMobile ? document.body : window,
    content: document.documentElement,
    smoothTouch: false, // Na mobile ide natívny touch fix cez CSS
    duration: 1.1, // Krásny hladký dojazd na PC
});

// Plynulé posúvanie k ukotveným odkazom (menu)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target);
        }
    });
});

// --- GSAP & SCROLLTRIGGER SYNC ---
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({
    scroller: scrollWrapper
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// Namiesto AOS spúšťame animácie cez GSAP (plynulejšie)
function initGSAPAnimations(elements) {
    elements.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 30 },
            {
                opacity: 1, 
                y: 0, 
                duration: 0.6, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    scroller: scrollWrapper,
                    start: "top 90%", // Spustí animáciu bez meškania (bez cascade delay)
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
        article.setAttribute('data-aos', 'true'); // Pre GSAP selektor
        
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
    
    // Po vygenerovaní blogov im priradíme GSAP animáciu
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
    lenis.stop(); // Bezpečnejšie zamknutie scrollu cez Lenis
}

function closeBlogModal() {
    const modal = document.getElementById('blog-modal');
    if (modal) modal.classList.remove('active');
    lenis.start(); // Odomknutie scrollu
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBlogModal();
});

// --- INICIALIZÁCIA STRÁNKY ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Nastavenia
    const savedLang = localStorage.getItem('selectedLang') || 'sk';
    setLanguage(savedLang);
    loadBlogPosts();
    
    // 2. Aplikovanie GSAP namiesto AOS pre všetky načítané prvky
    initGSAPAnimations(document.querySelectorAll('[data-aos]'));

    // 3. Mobilné Menu Logika
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const navLinks = document.getElementById('nav-links');
    const hamburgerIcon = document.getElementById('hamburger-icon');

    if (hamburgerToggle && navLinks) {
        hamburgerToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                hamburgerIcon.classList.remove('fa-bars');
                hamburgerIcon.classList.add('fa-xmark');
                lenis.stop(); // Používame Lenis na uzamknutie scrollu!
            } else {
                hamburgerIcon.classList.remove('fa-xmark');
                hamburgerIcon.classList.add('fa-bars');
                lenis.start(); 
            }
        });

        document.querySelectorAll('#nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburgerIcon.classList.remove('fa-xmark');
                hamburgerIcon.classList.add('fa-bars');
                lenis.start(); 
            });
        });
    }

    // 4. Kontakt formulár
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
