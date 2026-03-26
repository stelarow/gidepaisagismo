/* ===================================
   GIDE Paisagismo - Main JavaScript
   =================================== */

/* ===================================
   Blog Articles Data
   =================================== */
var BLOG_ARTICLES = [
    {
        category: 'Tendências',
        date: '15 Fev 2026',
        datetime: '2026-02-15',
        readtime: '6 min de leitura',
        image: 'images/blog/post-1.jpg',
        imageAlt: 'Design Biofílico',
        url: 'blog/post-1.html',
        title: 'Design Biofílico: A Arte de Trazer a Natureza para Dentro de Casa',
        excerpt: 'Descubra como o design biofílico transforma espaços comuns em ambientes que promovem bem-estar, produtividade e conexão com a natureza — e como aplicá-lo no seu projeto.'
    },
    {
        category: 'Plantas',
        date: '08 Fev 2026',
        datetime: '2026-02-08',
        readtime: '4 min de leitura',
        image: 'images/blog/post-2.jpg',
        imageAlt: 'Plantas Nativas',
        url: 'blog/post-2.html',
        title: '10 Plantas Nativas do Brasil que Transformam Qualquer Jardim',
        excerpt: 'Espécies adaptadas ao clima brasileiro, com beleza e baixíssima manutenção.'
    },
    {
        category: 'Dicas Práticas',
        date: '28 Jan 2026',
        datetime: '2026-01-28',
        readtime: '3 min de leitura',
        image: 'images/blog/post-3.jpg',
        imageAlt: 'Jardim Vertical',
        url: 'blog/post-3.html',
        title: 'Jardim Vertical: Solução Verde para Pequenos Espaços',
        excerpt: 'Como criar paredes vivas em apartamentos, sacadas e escritórios sem grandes obras.'
    }
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollTop();
    initializeLazyLoading();
    initializePortfolio();
    initializeBlogModal();
    initializeUrgencyBar();
});

/* ===================================
   Navigation
   =================================== */
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScroll = 0;

    // Sticky navbar on scroll
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Força repaint do hamburger no mobile após todos os scripts carregarem (fix iOS Safari)
    window.addEventListener('load', function() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        if (toggle && window.innerWidth <= 1024) {
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    void toggle.getBoundingClientRect();
                });
            });
        }
    });

    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Update ARIA
            const isExpanded = navMenu.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Active nav link tracking via getBoundingClientRect (respeita ordem DOM)
    var linkedSections = ['hero', 'servicos', 'sobre'];

    function updateActiveNav() {
        var navHeight = 80;
        var activeId = null;
        linkedSections.forEach(function(id) {
            var section = document.getElementById(id);
            if (!section) return;
            var rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom > navHeight) {
                activeId = id;
            }
        });
        navLinks.forEach(function(link) { link.classList.remove('active'); });
        if (activeId) {
            var link = document.querySelector('.nav-link[href="#' + activeId + '"]');
            if (link) link.classList.add('active');
        }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('resize', updateActiveNav);
    updateActiveNav();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                if (window.scrollExpansionHero) {
                    window.scrollExpansionHero.allowNavigation();
                }

                const offsetTop = targetElement.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===================================
   Scroll to Top Button
   =================================== */
function initializeScrollTop() {
    const scrollTopBtn = document.getElementById('scroll-top');

    if (!scrollTopBtn) return;

    // Show/hide button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    // Scroll to top on click
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ===================================
   Lazy Loading Images
   =================================== */
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => img.classList.add('loaded'));
    }
}

/* ===================================
   Portfolio Filter & Lightbox
   =================================== */
function initializePortfolio() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hide');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hide');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Initialize GLightbox
    if (typeof GLightbox !== 'undefined') {
        const lightbox = GLightbox({
            touchNavigation: true,
            loop: false,
            autoplayVideos: true
        });
    }
}

/* ===================================
   Scroll Indicator Animation
   =================================== */
const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
        const nextSection = document.getElementById('sobre');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Hide scroll indicator when scrolling down
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 200) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

/* ===================================
   Form Utilities
   =================================== */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\(\)\+]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    }

    input.value = value;
}

// Export for use in other modules
window.GIDEUtils = {
    validateEmail,
    validatePhone,
    formatPhone
};

/* ===================================
   Performance Optimization
   =================================== */

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll events are already handled above
}, 100));

/* ===================================
   Accessibility Enhancements
   =================================== */

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');

        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    }
});

// Focus trap for mobile menu
const focusableElements = 'a[href], button, input, select, textarea';

function trapFocus(element) {
    const focusable = element.querySelectorAll(focusableElements);
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    element.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    });
}

/* ===================================
   Blog Modal
   =================================== */
function initializeBlogModal() {
    var modal     = document.getElementById('blog-modal');
    var openBtn   = document.getElementById('blog-view-all-btn');
    var closeBtn  = document.getElementById('blog-modal-close');
    var backdrop  = modal ? modal.querySelector('.blog-modal__backdrop') : null;
    var filtersEl = document.getElementById('blog-modal-filters');
    var gridEl    = document.getElementById('blog-modal-grid');
    var countEl   = document.getElementById('blog-modal-count');

    if (!modal || !openBtn) return;

    var activeFilter = 'all';

    function getCategories() {
        var cats = ['all'];
        BLOG_ARTICLES.forEach(function(a) {
            if (cats.indexOf(a.category) === -1) cats.push(a.category);
        });
        return cats;
    }

    function renderFilters() {
        filtersEl.innerHTML = '';
        getCategories().forEach(function(cat) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'blog-modal__filter-btn' + (cat === activeFilter ? ' is-active' : '');
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', cat === activeFilter ? 'true' : 'false');
            btn.setAttribute('data-filter', cat);
            if (cat === 'all') {
                btn.setAttribute('data-i18n', 'blog.modal.all');
                btn.textContent = 'Todos';
            } else {
                btn.textContent = cat;
            }
            btn.addEventListener('click', function() {
                activeFilter = cat;
                renderFilters();
                filterCards();
                if (typeof applyLanguage === 'function') {
                    var lang = (function() { try { return localStorage.getItem('gide-lang') || 'pt-BR'; } catch(e) { return 'pt-BR'; } })();
                    applyLanguage(lang);
                }
            });
            filtersEl.appendChild(btn);
        });
    }

    function renderCards() {
        gridEl.innerHTML = '';
        BLOG_ARTICLES.forEach(function(a) {
            var card = document.createElement('article');
            card.className = 'blog-card';
            card.setAttribute('role', 'listitem');
            card.setAttribute('data-category', a.category);
            card.innerHTML =
                '<div class="blog-card__image">' +
                    '<img src="' + a.image + '" alt="' + a.imageAlt + '" loading="lazy">' +
                    '<span class="blog-card__category">' + a.category + '</span>' +
                '</div>' +
                '<div class="blog-card__content">' +
                    '<div class="blog-card__meta">' +
                        '<time datetime="' + a.datetime + '">' + a.date + '</time>' +
                        '<span class="blog-card__dot">·</span>' +
                        '<span>' + a.readtime + '</span>' +
                    '</div>' +
                    '<h3 class="blog-card__title">' + a.title + '</h3>' +
                    '<p class="blog-card__excerpt">' + a.excerpt + '</p>' +
                    '<a href="' + a.url + '" class="blog-card__link">' +
                        '<span data-i18n="blog.read_article">Ler Artigo</span> ' +
                        '<svg class="icon" aria-hidden="true"><use href="icons/sprite.svg#icon-arrow-right"></use></svg>' +
                    '</a>' +
                '</div>';
            gridEl.appendChild(card);
        });
    }

    function filterCards() {
        var cards = gridEl.querySelectorAll('.blog-card');
        var visible = 0;
        cards.forEach(function(card) {
            var match = activeFilter === 'all' || card.getAttribute('data-category') === activeFilter;
            if (match) { card.removeAttribute('hidden'); visible++; }
            else { card.setAttribute('hidden', ''); }
        });
        var t = (typeof translations !== 'undefined') ? (translations[localStorage.getItem('gide-lang') || 'pt-BR'] || translations['pt-BR']) : null;
        var one = t ? t['blog.modal.count_one'] : 'artigo';
        var other = t ? t['blog.modal.count_other'] : 'artigos';
        countEl.textContent = visible + ' ' + (visible === 1 ? one : other);
        var empty = gridEl.querySelector('.blog-modal__empty');
        if (visible === 0 && !empty) {
            var msg = document.createElement('p');
            msg.className = 'blog-modal__empty';
            var emptyMsg = t ? t['blog.modal.empty'] : 'Nenhum artigo nesta categoria.';
            msg.textContent = emptyMsg;
            gridEl.appendChild(msg);
        } else if (visible > 0 && empty) {
            empty.remove();
        }
    }

    function openModal() {
        renderFilters();
        renderCards();
        filterCards();
        if (typeof applyLanguage === 'function') {
            var lang = (function() { try { return localStorage.getItem('gide-lang') || 'pt-BR'; } catch(e) { return 'pt-BR'; } })();
            applyLanguage(lang);
        }
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.scrollSnapType = 'none';
        modal.scrollTop = 0;
        closeBtn.focus();
        trapFocus(modal);
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        document.documentElement.style.scrollSnapType = '';
        openBtn.focus();
    }

    openBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
    });
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
}

/* ===================================
   Urgency Bar Dismiss
   =================================== */
function initializeUrgencyBar() {
    var bar = document.getElementById('urgency-bar');
    var closeBtn = document.getElementById('urgency-bar-close');
    if (!bar || !closeBtn) return;

    // Restore dismissed state from session
    if (sessionStorage.getItem('urgencyBarDismissed')) {
        bar.classList.add('dismissed');
        return;
    }

    closeBtn.addEventListener('click', function() {
        bar.classList.add('dismissed');
        sessionStorage.setItem('urgencyBarDismissed', '1');
    });
}


/* ===================================
   Console Credits
   =================================== */
console.log('%c🌿 GIDE Paisagismo', 'color: #2d5f3f; font-size: 24px; font-weight: bold;');
console.log('%cWebsite desenvolvido com paixão e dedicação', 'color: #78b719; font-size: 14px;');
console.log('%cTransformando espaços verdes desde 2009', 'color: #a67c52; font-size: 12px;');
