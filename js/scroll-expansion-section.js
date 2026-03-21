/* ===================================
   GIDI Paisagismo - Scroll Expansion Section
   Seção genérica com comportamento de expansão por scroll
   (para seções no meio da página — não força scrollY=0)
   =================================== */

class ScrollExpansionSection {
    constructor(options = {}) {
        this.options = {
            sectionId: options.sectionId || 'eventos',
            mediaType: options.mediaType || 'video',
            mediaSrc: options.mediaSrc || 'heroGidi.mp4',
            bgImageSrc: options.bgImageSrc || 'plantasgidi.jpeg',
            bgVideoSrc: options.bgVideoSrc || '',
            posterSrc: options.posterSrc || '',
            title: options.title || 'Eventos',
            subtitle: options.subtitle || 'Transforme seus Eventos',
            scrollToExpand: options.scrollToExpand || 'Role para explorar',
            textBlend: options.textBlend || false,
            nextSectionId: options.nextSectionId || 'processo',
            ...options
        };

        this.scrollProgress = 0;
        this.targetProgress = 0;
        this.animationRunning = false;
        this.showContent = false;
        this.mediaFullyExpanded = false;
        this.touchStartY = 0;
        this.touchStartTarget = null;
        this.navigationOverride = false;
        this._navOverrideTimer = null;
        this.expansionCooldown = false;
        this._expansionCooldownTimer = null;
        this.sectionVisible = false;
        this._visibilityObserver = null;
        this.isMobile = window.innerWidth < 768;
        this.elements = {};

        this.init();
    }

    init() {
        this.createElements();
        this.setupEventListeners();
        this.checkIfMobile();
        this._setupVisibilityObserver();
    }

    createElements() {
        const section = document.getElementById(this.options.sectionId);
        if (!section) return;

        const id = this.options.sectionId;

        section.innerHTML = '';
        section.classList.add('scroll-expansion-hero');

        // Background layer
        const bgLayer = document.createElement('div');
        bgLayer.className = 'hero-bg-layer';
        if (this.options.bgVideoSrc) {
            bgLayer.innerHTML = `
                <video src="${this.options.bgVideoSrc}" autoplay muted loop playsinline class="hero-bg-video"></video>
                <div class="hero-bg-overlay"></div>
            `;
        } else {
            bgLayer.innerHTML = `
                <img src="${this.options.bgImageSrc}" alt="Background" class="hero-bg-image">
                <div class="hero-bg-overlay"></div>
            `;
        }

        // Media container
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'hero-media-container';
        mediaContainer.id = `${id}MediaContainer`;

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
        textContainer.id = `${id}TextContainer`;

        const firstWord = this.options.title.split(' ')[0];
        const restOfTitle = this.options.title.split(' ').slice(1).join(' ');

        textContainer.innerHTML = `
            <div class="hero-title-wrapper ${this.options.textBlend ? 'text-blend' : ''}">
                <h2 class="hero-title-first" id="${id}TitleFirst">${firstWord}</h2>
                <h2 class="hero-title-rest" id="${id}TitleRest">${restOfTitle}</h2>
            </div>
            <p class="hero-subtitle" id="${id}Subtitle">${this.options.subtitle}</p>
        `;

        // Scroll indicator
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'hero-scroll-indicator';
        scrollIndicator.id = `${id}ScrollIndicator`;
        scrollIndicator.innerHTML = `
            <p>${this.options.scrollToExpand}</p>
            <i class="fas fa-chevron-down"></i>
        `;

        // Content section (placeholder — not used for mid-page sections)
        const contentSection = document.createElement('div');
        contentSection.className = 'hero-content-section';
        contentSection.id = `${id}ContentSection`;

        section.appendChild(bgLayer);
        section.appendChild(mediaContainer);
        section.appendChild(textContainer);
        section.appendChild(scrollIndicator);
        section.appendChild(contentSection);

        this.elements = {
            section,
            bgLayer,
            mediaContainer,
            textContainer,
            scrollIndicator,
            contentSection,
            titleFirst: document.getElementById(`${id}TitleFirst`),
            titleRest: document.getElementById(`${id}TitleRest`),
            subtitle: document.getElementById(`${id}Subtitle`)
        };

        this.updateProgress(0);
    }

    setupEventListeners() {
        this._handleWheel = this.handleWheel.bind(this);
        this._handleTouchStart = this.handleTouchStart.bind(this);
        this._handleTouchMove = this.handleTouchMove.bind(this);
        this._handleTouchEnd = this.handleTouchEnd.bind(this);
        this._handleScroll = this.handleScroll.bind(this);
        this._checkIfMobile = this.checkIfMobile.bind(this);

        window.addEventListener('wheel', this._handleWheel, { passive: false });
        window.addEventListener('touchstart', this._handleTouchStart, { passive: false });
        window.addEventListener('touchmove', this._handleTouchMove, { passive: false });
        window.addEventListener('touchend', this._handleTouchEnd);
        window.addEventListener('scroll', this._handleScroll);
        window.addEventListener('resize', this._checkIfMobile);
    }

    _isAtSectionTop() {
        if (!this.elements.section) return false;
        const rect = this.elements.section.getBoundingClientRect();
        return rect.top > -5 && rect.top < 10;
    }

    handleWheel(e) {
        if (!this.sectionVisible) return;
        if (!this._isAtSectionTop()) return;

        if (this.mediaFullyExpanded && e.deltaY < 0) {
            // Scroll para cima expandido → colapsar
            this.mediaFullyExpanded = false;
            this.showContent = false;
            e.preventDefault();
            this.targetProgress = 0;
            this.startAnimationLoop();
        } else if (this.mediaFullyExpanded && !this.expansionCooldown && e.deltaY > 0) {
            // Segundo scroll para baixo → navegar para próxima seção
            e.preventDefault();
            const next = document.getElementById(this.options.nextSectionId);
            if (next) {
                this.allowNavigation();
                next.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (this.mediaFullyExpanded && this.expansionCooldown && e.deltaY > 0) {
            // Cooldown: drenar inércia sem navegar
            e.preventDefault();
        } else if (!this.mediaFullyExpanded && e.deltaY > 0) {
            // Primeiro scroll para baixo → expandir
            e.preventDefault();
            this.targetProgress = 1;
            this.startAnimationLoop();
        }
        // Scroll para cima não expandido → deixa o browser rolar normalmente (volta para serviços)
    }

    handleTouchStart(e) {
        if (!this.sectionVisible) return;
        this.touchStartY = e.touches[0].clientY;
        this.touchStartTarget = e.target;
    }

    handleTouchMove(e) {
        if (!this.sectionVisible) return;
        if (!this.touchStartY) return;
        if (this.touchStartTarget && this.touchStartTarget.closest('.navbar')) return;
        if (!this._isAtSectionTop()) return;

        const touchY = e.touches[0].clientY;
        const deltaY = this.touchStartY - touchY;

        if (this.mediaFullyExpanded && deltaY < -20) {
            // Swipe para cima expandido → colapsar
            this.mediaFullyExpanded = false;
            this.showContent = false;
            e.preventDefault();
            this.targetProgress = 0;
            this.startAnimationLoop();
        } else if (this.mediaFullyExpanded && !this.expansionCooldown && deltaY > 20) {
            // Segundo swipe para baixo → próxima seção
            e.preventDefault();
            const next = document.getElementById(this.options.nextSectionId);
            if (next) {
                this.allowNavigation();
                next.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (this.mediaFullyExpanded && this.expansionCooldown && deltaY > 0) {
            e.preventDefault();
        } else if (!this.mediaFullyExpanded && deltaY > 10) {
            // Primeiro swipe para baixo → expandir
            e.preventDefault();
            this.targetProgress = 1;
            this.startAnimationLoop();
            this.touchStartY = touchY;
        }
        // Swipe para cima não expandido → scroll normal para serviços
    }

    handleTouchEnd() {
        this.touchStartY = 0;
        this.touchStartTarget = null;
    }

    allowNavigation() {
        this.navigationOverride = true;
        clearTimeout(this._navOverrideTimer);
        this._navOverrideTimer = setTimeout(() => {
            this.navigationOverride = false;
        }, 1200);
    }

    handleScroll() {
        if (!this.sectionVisible || this.mediaFullyExpanded || this.navigationOverride) return;
        const rect = this.elements.section.getBoundingClientRect();
        // Se a seção passou levemente do topo da viewport (até 15px), traz de volta
        if (rect.top < 0 && rect.top > -15) {
            window.scrollTo({ top: window.scrollY + rect.top, behavior: 'instant' });
        }
    }

    checkIfMobile() {
        this.isMobile = window.innerWidth < 768;
    }

    _setupVisibilityObserver() {
        const section = this.elements && this.elements.section;
        if (!section || !('IntersectionObserver' in window)) return;

        this._visibilityObserver = new IntersectionObserver((entries) => {
            this.sectionVisible = entries[0].isIntersecting;
        }, { threshold: 0.1 });

        this._visibilityObserver.observe(section);
    }

    startAnimationLoop() {
        if (this.animationRunning) return;
        this.animationRunning = true;

        const startProgress = this.scrollProgress;
        const endProgress = this.targetProgress;
        const duration = 700;
        const startTime = performance.now();

        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

        const loop = (currentTime) => {
            const elapsed = currentTime - startTime;
            const t = Math.min(elapsed / duration, 1);

            this.scrollProgress = startProgress + (endProgress - startProgress) * easeOutCubic(t);

            if (endProgress >= 1 && this.scrollProgress >= 0.75) {
                this.showContent = true;
            }

            this.updateProgress(this.scrollProgress);

            if (t >= 1) {
                this.scrollProgress = endProgress;
                this.updateProgress(this.scrollProgress);

                if (endProgress >= 1) {
                    this.mediaFullyExpanded = true;
                    this.showContent = true;
                    this.expansionCooldown = true;
                    clearTimeout(this._expansionCooldownTimer);
                    this._expansionCooldownTimer = setTimeout(() => {
                        this.expansionCooldown = false;
                        // Não altera scrollY (diferente do hero que reseta para 0)
                    }, 200);
                }

                this.animationRunning = false;
                return;
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    updateProgress(newProgress) {
        this.scrollProgress = newProgress;

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const startW = this.isMobile ? Math.round(vw * 0.65) : 480;
        const startH = this.isMobile ? Math.round(vw * 0.37) : 270;
        const endW   = this.isMobile ? vw * 0.88 : Math.min(vw * 0.95, 1600);
        const endH   = this.isMobile ? Math.min(vh * 0.72, 700) : Math.min(vh * 0.88, 900);

        const mediaWidth   = startW + this.scrollProgress * (endW - startW);
        const mediaHeight  = startH + this.scrollProgress * (endH - startH);
        const borderRadius = 16 * (1 - this.scrollProgress);

        const textTranslateX      = this.scrollProgress * 150;
        const bgOpacity           = 1 - this.scrollProgress;
        const mediaOverlayOpacity = 0.5 - this.scrollProgress * 0.3;
        const contentOpacity      = this.showContent ? 1 : 0;

        this.elements.mediaContainer.style.width        = `${Math.min(mediaWidth,  vw * 0.98)}px`;
        this.elements.mediaContainer.style.height       = `${Math.min(mediaHeight, vh * 0.92)}px`;
        this.elements.mediaContainer.style.borderRadius = `${borderRadius}px`;

        this.elements.bgLayer.style.opacity = bgOpacity;

        if (this.elements.titleFirst) {
            this.elements.titleFirst.style.transform = `translateX(-${textTranslateX}vw)`;
        }
        if (this.elements.titleRest) {
            this.elements.titleRest.style.transform = `translateX(${textTranslateX}vw)`;
        }

        this.elements.scrollIndicator.style.opacity   = 1 - this.scrollProgress * 2;
        this.elements.scrollIndicator.style.transform = `translateY(${this.scrollProgress * 50}px)`;

        const mediaOverlay = this.elements.mediaContainer.querySelector('.hero-media-overlay');
        if (mediaOverlay) {
            mediaOverlay.style.opacity = mediaOverlayOpacity;
        }

        this.elements.contentSection.style.opacity       = contentOpacity;
        this.elements.contentSection.style.pointerEvents = this.showContent ? 'auto' : 'none';
    }

    destroy() {
        window.removeEventListener('wheel', this._handleWheel);
        window.removeEventListener('touchstart', this._handleTouchStart);
        window.removeEventListener('touchmove', this._handleTouchMove);
        window.removeEventListener('touchend', this._handleTouchEnd);
        window.removeEventListener('scroll', this._handleScroll);
        window.removeEventListener('resize', this._checkIfMobile);

        if (this._visibilityObserver) {
            this._visibilityObserver.disconnect();
            this._visibilityObserver = null;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollExpansionSection;
}
