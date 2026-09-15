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
        // Pridaný data-aos atribút aj pre dynamicky generované články
        article.setAttribute('data-aos', 'fade-up');
        article.setAttribute('data-aos-delay', (index % 3) * 100); 

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
}

function openBlogModal(index) {
    const item = globalBlogItems[index];
    if (!item) return;
    
    document.getElementById('modal-title-sk').innerText = item.title_sk || item.title || '';
    document.getElementById('modal-title-en').innerText = item.title_en || item.title || '';
    document.getElementById('modal-date').innerText = item.date || '';
    
    // Konverzia Markdown na HTML ak je knižnica načítaná
    const parseContent = (text) => {
        if (!text) return '';
        return typeof marked !== 'undefined' ? marked.parse(text) : text.replace(/\n/g, '<br>');
    };

    document.getElementById('modal-content-sk').innerHTML = parseContent(item.content_sk || item.body || item.desc_sk);
    document.getElementById('modal-content-en').innerHTML = parseContent(item.content_en || item.body || item.desc_en);
    
    document.getElementById('blog-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBlogModal() {
    const modal = document.getElementById('blog-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Zatvorenie modálneho okna stlačením klávesy ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBlogModal();
});

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang') || 'sk';
    setLanguage(savedLang);
    loadBlogPosts();

    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const navLinks = document.getElementById('nav-links');
    const hamburgerIcon = document.getElementById('hamburger-icon');

    if (hamburgerToggle && navLinks) {
        hamburgerToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                hamburgerIcon.classList.remove('fa-bars');
                hamburgerIcon.classList.add('fa-xmark');
                // Zablokuje scrollovanie pozadia pri otvorenom menu
                document.body.style.overflow = 'hidden'; 
            } else {
                hamburgerIcon.classList.remove('fa-xmark');
                hamburgerIcon.classList.add('fa-bars');
                // Odblokuje scrollovanie
                document.body.style.overflow = ''; 
            }
        });

        document.querySelectorAll('#nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburgerIcon.classList.remove('fa-xmark');
                hamburgerIcon.classList.add('fa-bars');
                // Odblokuje scrollovanie po kliknutí na odkaz v menu
                document.body.style.overflow = ''; 
            });
        });
    }

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
                    formStatus.innerText = 'Thank you! Your message has been sent successfully. I will get back to you soon.';
                } else {
                    formStatus.style.color = '#28a745';
                    formStatus.innerText = 'Ďakujem! Vaša správa bola úspešne odoslaná. Čoskoro sa vám ozvem.';
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

// Netlify Identity presmerovanie po prihlásení
if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
        if (!user) {
            window.netlifyIdentity.on("login", () => {
                document.location.href = "/admin/";
            });
        }
    });
}
