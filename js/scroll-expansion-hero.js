/* ===================================
   GIDI Paisagismo - Scroll Expansion Hero
   Adaptado de React para Vanilla JS
   =================================== */

class ScrollExpansionHero {
    constructor(options = {}) {
        this.options = {
            mediaType: options.mediaType || 'image', // 'image' or 'video'
            mediaSrc: options.mediaSrc || 'images/hero-bg.jpg',
            bgImageSrc: options.bgImageSrc || 'images/hero-bg.jpg',
            posterSrc: options.posterSrc || '',
            title: options.title || 'GIDI Paisagismo',
            subtitle: options.subtitle || 'Transforme Seus Espaços Verdes',
            scrollToExpand: options.scrollToExpand || 'Role para expandir',
            textBlend: options.textBlend || false,
            ...options
        };

        this.scrollProgress = 0;
        this.showContent = false;
        this.mediaFullyExpanded = false;
        this.touchStartY = 0;
        this.isMobile = window.innerWidth < 768;

        this.init();
    }

    init() {
        this.createElements();
        this.setupEventListeners();
        this.checkIfMobile();
    }

    createElements() {
        const hero = document.getElementById('hero');
        if (!hero) return;

        // Limpar conteúdo existente
        hero.innerHTML = '';
        hero.classList.add('scroll-expansion-hero');

        // Background layer
        const bgLayer = document.createElement('div');
        bgLayer.className = 'hero-bg-layer';
        bgLayer.innerHTML = `
            <img src="${this.options.bgImageSrc}" alt="Background" class="hero-bg-image">
            <div class="hero-bg-overlay"></div>
        `;

        // Media container
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'hero-media-container';
        mediaContainer.id = 'heroMediaContainer';

        if (this.options.mediaType === 'video') {
            mediaContainer.innerHTML = `
                <video
                    src="${this.options.mediaSrc}"
                    ${this.options.posterSrc ? `poster="${this.options.posterSrc}"` : ''}
                    autoplay
                    muted
                    loop
                    playsinline
                    class="hero-media-video">
                </video>
                <div class="hero-media-overlay"></div>
            `;
        } else {
            mediaContainer.innerHTML = `
                <img src="${this.options.mediaSrc}" alt="${this.options.title}" class="hero-media-image">
                <div class="hero-media-overlay"></div>
            `;
        }

        // Text container
        const textContainer = document.createElement('div');
        textContainer.className = 'hero-text-container';
        textContainer.id = 'heroTextContainer';

        const firstWord = this.options.title.split(' ')[0];
        const restOfTitle = this.options.title.split(' ').slice(1).join(' ');

        textContainer.innerHTML = `
            <div class="hero-title-wrapper ${this.options.textBlend ? 'text-blend' : ''}">
                <h1 class="hero-title-first" id="heroTitleFirst">${firstWord}</h1>
                <h1 class="hero-title-rest" id="heroTitleRest">${restOfTitle}</h1>
            </div>
            <p class="hero-subtitle" id="heroSubtitle">${this.options.subtitle}</p>
        `;

        // Scroll indicator
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'hero-scroll-indicator';
        scrollIndicator.id = 'heroScrollIndicator';
        scrollIndicator.innerHTML = `
            <p>${this.options.scrollToExpand}</p>
            <i class="fas fa-chevron-down"></i>
        `;

        // Content section (appears after expansion)
        const contentSection = document.createElement('div');
        contentSection.className = 'hero-content-section';
        contentSection.id = 'heroContentSection';
        contentSection.innerHTML = `
            <div class="container">
                <div class="hero-content-wrapper">
                    <!-- O conteúdo existente do site virá aqui -->
                </div>
            </div>
        `;

        // Append all elements
        hero.appendChild(bgLayer);
        hero.appendChild(mediaContainer);
        hero.appendChild(textContainer);
        hero.appendChild(scrollIndicator);
        hero.appendChild(contentSection);

        // Store references
        this.elements = {
            hero,
            bgLayer,
            mediaContainer,
            textContainer,
            scrollIndicator,
            contentSection,
            titleFirst: document.getElementById('heroTitleFirst'),
            titleRest: document.getElementById('heroTitleRest'),
            subtitle: document.getElementById('heroSubtitle')
        };
    }

    setupEventListeners() {
        // Wheel event
        window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });

        // Touch events
        window.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        window.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        window.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Scroll event
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // Resize event
        window.addEventListener('resize', this.checkIfMobile.bind(this));
    }

    handleWheel(e) {
        if (this.mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
            this.mediaFullyExpanded = false;
            e.preventDefault();
            this.updateProgress(0.99);
        } else if (!this.mediaFullyExpanded) {
            e.preventDefault();
            const scrollDelta = e.deltaY * 0.0009;
            const newProgress = Math.min(Math.max(this.scrollProgress + scrollDelta, 0), 1);
            this.updateProgress(newProgress);

            if (newProgress >= 1) {
                this.mediaFullyExpanded = true;
                this.showContent = true;
            } else if (newProgress < 0.75) {
                this.showContent = false;
            }
        }
    }

    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        if (!this.touchStartY) return;

        const touchY = e.touches[0].clientY;
        const deltaY = this.touchStartY - touchY;

        if (this.mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
            this.mediaFullyExpanded = false;
            e.preventDefault();
        } else if (!this.mediaFullyExpanded) {
            e.preventDefault();
            const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
            const scrollDelta = deltaY * scrollFactor;
            const newProgress = Math.min(Math.max(this.scrollProgress + scrollDelta, 0), 1);
            this.updateProgress(newProgress);

            if (newProgress >= 1) {
                this.mediaFullyExpanded = true;
                this.showContent = true;
            } else if (newProgress < 0.75) {
                this.showContent = false;
            }

            this.touchStartY = touchY;
        }
    }

    handleTouchEnd() {
        this.touchStartY = 0;
    }

    handleScroll() {
        if (!this.mediaFullyExpanded) {
            window.scrollTo(0, 0);
        }
    }

    checkIfMobile() {
        this.isMobile = window.innerWidth < 768;
    }

    updateProgress(newProgress) {
        this.scrollProgress = newProgress;

        // Calculate dimensions
        const mediaWidth = 300 + this.scrollProgress * (this.isMobile ? 650 : 1250);
        const mediaHeight = 400 + this.scrollProgress * (this.isMobile ? 200 : 400);
        const textTranslateX = this.scrollProgress * (this.isMobile ? 180 : 150);
        const bgOpacity = 1 - this.scrollProgress;
        const mediaOverlayOpacity = 0.5 - this.scrollProgress * 0.3;
        const contentOpacity = this.showContent ? 1 : 0;

        // Update media container
        this.elements.mediaContainer.style.width = `${Math.min(mediaWidth, window.innerWidth * 0.95)}px`;
        this.elements.mediaContainer.style.height = `${Math.min(mediaHeight, window.innerHeight * 0.85)}px`;

        // Update background layer
        this.elements.bgLayer.style.opacity = bgOpacity;

        // Update text positions
        if (this.elements.titleFirst) {
            this.elements.titleFirst.style.transform = `translateX(-${textTranslateX}vw)`;
        }
        if (this.elements.titleRest) {
            this.elements.titleRest.style.transform = `translateX(${textTranslateX}vw)`;
        }

        // Update scroll indicator
        this.elements.scrollIndicator.style.opacity = 1 - this.scrollProgress * 2;
        this.elements.scrollIndicator.style.transform = `translateY(${this.scrollProgress * 50}px)`;

        // Update media overlay
        const mediaOverlay = this.elements.mediaContainer.querySelector('.hero-media-overlay');
        if (mediaOverlay) {
            mediaOverlay.style.opacity = mediaOverlayOpacity;
        }

        // Update content section
        this.elements.contentSection.style.opacity = contentOpacity;
        this.elements.contentSection.style.pointerEvents = this.showContent ? 'auto' : 'none';
    }

    reset() {
        this.scrollProgress = 0;
        this.showContent = false;
        this.mediaFullyExpanded = false;
        this.updateProgress(0);
        window.scrollTo(0, 0);
    }

    destroy() {
        window.removeEventListener('wheel', this.handleWheel.bind(this));
        window.removeEventListener('touchstart', this.handleTouchStart.bind(this));
        window.removeEventListener('touchmove', this.handleTouchMove.bind(this));
        window.removeEventListener('touchend', this.handleTouchEnd.bind(this));
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        window.removeEventListener('resize', this.checkIfMobile.bind(this));
    }
}

// Initialize quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se existe o elemento hero
    if (document.getElementById('hero')) {
        // Inicializar com as configurações do GIDI Paisagismo
        window.scrollExpansionHero = new ScrollExpansionHero({
            mediaType: 'image',
            mediaSrc: 'images/hero-bg.jpg',
            bgImageSrc: 'images/hero-bg.jpg',
            title: 'GIDI Paisagismo',
            subtitle: 'Transformando Espaços Verdes',
            scrollToExpand: 'Role para explorar',
            textBlend: true
        });
    }
});

// Export para uso externo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollExpansionHero;
}
