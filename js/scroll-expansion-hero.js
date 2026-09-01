/* ===================================
   GIDE Paisagismo - Scroll Expansion Hero
   Adaptado de React para Vanilla JS
   =================================== */

class ScrollExpansionHero {
    constructor(options = {}) {
        this.options = {
            mediaType: options.mediaType || 'image', // 'image' or 'video'
            mediaSrc: options.mediaSrc || 'plantasgide.jpeg',
            bgImageSrc: options.bgImageSrc || 'plantasgide.jpeg',
            bgVideoSrc: options.bgVideoSrc || '',
            posterSrc: options.posterSrc || '',
            title: options.title || 'GIDE Paisagismo',
            subtitle: options.subtitle || 'Paisagismo sob medida para jardins, empresas e eventos',
            scrollToExpand: options.scrollToExpand || 'Role para expandir',
            textBlend: options.textBlend || false,
            ...options
        };

        this.scrollProgress = 0;
        this.targetProgress = 0;
        this.animationRunning = false;
        this.showContent = false;
        this.mediaFullyExpanded = false;
        this.touchStartY = 0;
        this.navigationOverride = false;
        this._navOverrideTimer  = null;
        this.expansionCooldown = false;
        this._expansionCooldownTimer = null;
        this.heroVisible = true;
        this._visibilityObserver = null;
        this.isMobile = window.innerWidth < 768;

        this.init();
    }

    init() {
        const initialHashTarget = this.getInitialHashTarget();
        document.documentElement.style.scrollSnapType = 'none';
        if (!initialHashTarget) {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
        requestAnimationFrame(() => {
            document.documentElement.style.scrollSnapType = '';
        });
        this.createElements();
        this.setupEventListeners();
        this.checkIfMobile();
        this._setupVisibilityObserver();
        if (initialHashTarget) {
            this.navigateToInitialHash(initialHashTarget);
        }
    }

    getInitialHashTarget() {
        const hash = window.location.hash;
        if (!hash || hash === '#' || hash === '#hero') return null;
        try {
            return document.querySelector(hash);
        } catch (error) {
            return null;
        }
    }

    navigateToInitialHash(targetElement) {
        this.navigationOverride = true;
        this.mediaFullyExpanded = true;
        this.showContent = true;
        this.targetProgress = 1;
        this.scrollProgress = 1;

        requestAnimationFrame(() => {
            this.updateProgress(1);
            const navbar = document.getElementById('navbar');
            const navOffset = navbar ? navbar.offsetHeight + 10 : 80;
            const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - navOffset;
            window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'auto' });

            clearTimeout(this._navOverrideTimer);
            this._navOverrideTimer = setTimeout(() => {
                this.navigationOverride = false;
            }, 1500);
        });
    }

    createElements() {
        const hero = document.getElementById('hero');
        if (!hero) return;

        // Reaproveitar o vídeo já presente no HTML para que ele comece a carregar
        // antes da inicialização do JavaScript, sem um flash branco no hero.
        const existingBgLayer = hero.querySelector('.hero-bg-layer');
        hero.replaceChildren();
        hero.classList.add('scroll-expansion-hero');

        // Background layer
        const bgLayer = existingBgLayer || document.createElement('div');
        bgLayer.className = 'hero-bg-layer';
        if (!existingBgLayer && this.options.bgVideoSrc) {
            bgLayer.innerHTML = `
                <video src="${this.options.bgVideoSrc}" autoplay muted loop playsinline preload="auto" poster="${this.options.posterSrc}" class="hero-bg-video"></video>
                <div class="hero-bg-overlay"></div>
            `;
        } else if (!existingBgLayer) {
            bgLayer.innerHTML = `
                <img src="${this.options.bgImageSrc}" alt="Background" class="hero-bg-image">
                <div class="hero-bg-overlay"></div>
            `;
        }

        this.startBackgroundVideo(bgLayer.querySelector('.hero-bg-video'));

        // Text container
        const textContainer = document.createElement('div');
        textContainer.className = 'hero-text-container';
        textContainer.id = 'heroTextContainer';

        const firstWord = this.options.title.split(' ')[0];
        const restOfTitle = this.options.title.split(' ').slice(1).join(' ');

        textContainer.innerHTML = `
            <div class="hero-title-wrapper ${this.options.textBlend ? 'text-blend' : ''}">
                <h1 class="hero-title-first" id="heroTitleFirst">${firstWord}</h1>
                <h1 class="hero-title-rest" id="heroTitleRest" data-i18n="hero.title.rest">${restOfTitle}</h1>
            </div>
            <p class="hero-subtitle" id="heroSubtitle" data-i18n="hero.subtitle">${this.options.subtitle}</p>
        `;

        // Scroll indicator
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'hero-scroll-indicator';
        scrollIndicator.id = 'heroScrollIndicator';
        scrollIndicator.innerHTML = `
            <p data-i18n="hero.scroll">${this.options.scrollToExpand}</p>
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
        hero.appendChild(textContainer);
        hero.appendChild(scrollIndicator);
        hero.appendChild(contentSection);

        // Store references
        this.elements = {
            hero,
            bgLayer,
            mediaContainer: null,
            textContainer,
            scrollIndicator,
            contentSection,
            titleFirst: document.getElementById('heroTitleFirst'),
            titleRest: document.getElementById('heroTitleRest'),
            subtitle: document.getElementById('heroSubtitle')
        };

        // Aplicar dimensões iniciais (retrato) imediatamente
        this.updateProgress(0);
    }

    startBackgroundVideo(video) {
        if (!video) return;

        const playFromAnimatedFrame = () => {
            if (video.currentTime < 0.15) {
                try {
                    video.currentTime = 0.15;
                } catch (error) {
                    // Alguns navegadores só permitem buscar após os metadados.
                }
            }
            const playback = video.play();
            if (playback) playback.catch(() => {});
        };

        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
            playFromAnimatedFrame();
        } else {
            video.addEventListener('loadedmetadata', playFromAnimatedFrame, { once: true });
        }
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

    isNavbarInteraction(event) {
        return event && event.target && event.target.closest && event.target.closest('.navbar');
    }

    handleWheel(e) {
        if (!this.heroVisible) return;
        if (this.isNavbarInteraction(e)) return;
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) return;
        if (this.mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
            // Scroll para cima no topo → colapso
            this.mediaFullyExpanded = false;
            this.showContent = false;
            e.preventDefault();
            this.targetProgress = 0;
            this.startAnimationLoop();
        } else if (this.mediaFullyExpanded && !this.expansionCooldown && e.deltaY > 0 && window.scrollY <= 100) {
            // Segundo scroll para baixo → descer para a página
            e.preventDefault();
            const servicos = document.getElementById('servicos');
            if (servicos) servicos.scrollIntoView({ behavior: 'smooth' });
        } else if (this.mediaFullyExpanded && this.expansionCooldown && e.deltaY > 0 && window.scrollY <= 100) {
            // Durante cooldown: drenar inércia sem navegar e sem deixar browser scrollar
            e.preventDefault();
        } else if (!this.mediaFullyExpanded && e.deltaY > 0 && window.scrollY <= 5) {
            // Primeiro scroll para baixo → expandir (só quando já no topo)
            e.preventDefault();
            this.targetProgress = 1;
            this.startAnimationLoop();
        } else if (!this.mediaFullyExpanded && window.scrollY <= 5) {
            // Bloquear scroll acima do topo apenas quando já no topo
            e.preventDefault();
        }
        // Se scrollY > 5 e hero não expandido, permite scroll livre (usuário voltando ao topo)
    }

    handleTouchStart(e) {
        if (!this.heroVisible) return;
        if (this.isNavbarInteraction(e)) {
            this.touchStartY = 0;
            this.touchStartTarget = null;
            return;
        }
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) return;
        this.touchStartY = e.touches[0].clientY;
        this.touchStartTarget = e.target;
    }

    handleTouchMove(e) {
        if (!this.heroVisible) return;
        if (!this.touchStartY) return;
        if (this.isNavbarInteraction(e)) return;
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) return;
        if (this.touchStartTarget && this.touchStartTarget.closest('.navbar')) return;

        const touchY = e.touches[0].clientY;
        const deltaY = this.touchStartY - touchY;

        if (this.mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
            // Swipe para cima no topo → colapso
            this.mediaFullyExpanded = false;
            this.showContent = false;
            e.preventDefault();
            this.targetProgress = 0;
            this.startAnimationLoop();
        } else if (this.mediaFullyExpanded && !this.expansionCooldown && deltaY > 20 && window.scrollY <= 100) {
            // Segundo swipe para baixo → descer para a página
            e.preventDefault();
            const servicos = document.getElementById('servicos');
            if (servicos) servicos.scrollIntoView({ behavior: 'smooth' });
        } else if (this.mediaFullyExpanded && this.expansionCooldown && deltaY > 0 && window.scrollY <= 100) {
            // Durante cooldown: drenar inércia sem navegar
            e.preventDefault();
        } else if (!this.mediaFullyExpanded && deltaY > 10 && window.scrollY <= 5) {
            // Primeiro swipe para baixo → expandir (só quando já no topo)
            e.preventDefault();
            this.targetProgress = 1;
            this.startAnimationLoop();
            this.touchStartY = touchY;
        } else if (!this.mediaFullyExpanded && window.scrollY <= 5) {
            // Bloquear scroll acima do topo apenas quando já no topo
            e.preventDefault();
        }
    }

    handleTouchEnd() {
        this.touchStartY = 0;
    }

    allowNavigation() {
        this.navigationOverride = true;
        clearTimeout(this._navOverrideTimer);
        this._navOverrideTimer = setTimeout(() => {
            this.navigationOverride = false;
        }, 1200);
    }

    navigateToTarget(targetElement, options = {}) {
        if (!targetElement) return;

        const isHeroTarget = targetElement.id === 'hero';
        const behavior = options.behavior || 'smooth';
        const navbar = document.getElementById('navbar');
        const navOffset = isHeroTarget ? 0 : (navbar ? navbar.offsetHeight + 10 : 80);

        this.allowNavigation();
        document.documentElement.style.scrollSnapType = 'none';

        if (isHeroTarget) {
            this.reset();
        } else {
            this.mediaFullyExpanded = true;
            this.showContent = true;
            this.expansionCooldown = false;
            this.targetProgress = 1;
            this.scrollProgress = 1;
            this.updateProgress(1);

            const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - navOffset;
            window.scrollTo({
                top: Math.max(targetTop, 0),
                behavior
            });
        }

        clearTimeout(this._navOverrideTimer);
        this._navOverrideTimer = setTimeout(() => {
            this.navigationOverride = false;
            document.documentElement.style.scrollSnapType = '';
        }, behavior === 'smooth' ? 1800 : 300);
    }

    handleScroll() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) return;
        if (!this.mediaFullyExpanded && !this.navigationOverride && this.heroVisible && window.scrollY <= 5) {
            window.scrollTo(0, 0);
        }
    }

    checkIfMobile() {
        this.isMobile = window.innerWidth < 768;
    }

    _setupVisibilityObserver() {
        const hero = this.elements && this.elements.hero;
        if (!hero || !('IntersectionObserver' in window)) return;

        this._visibilityObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            this.heroVisible = entry.isIntersecting;

            // Ao retornar ao hero não expandido, garantir posição 0
            if (this.heroVisible && !this.mediaFullyExpanded && window.scrollY <= 5) {
                window.scrollTo(0, 0);
            }
        }, { threshold: 0.1 });

        this._visibilityObserver.observe(hero);
    }

    startAnimationLoop() {
        if (this.animationRunning) return;
        this.animationRunning = true;

        const startProgress = this.scrollProgress;
        const endProgress   = this.targetProgress;
        const duration      = 700; // ms — rápido e fluido
        const startTime     = performance.now();

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
                    // Cooldown: bloqueia navegação imediata por inércia do trackpad
                    this.expansionCooldown = true;
                    clearTimeout(this._expansionCooldownTimer);
                    this._expansionCooldownTimer = setTimeout(() => {
                        this.expansionCooldown = false;
                        setTimeout(() => {
                            const servicos = document.getElementById('servicos');
                            if (servicos) servicos.scrollIntoView({ behavior: 'smooth' });
                        }, 500);
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

        // Paisagem (minimizado) → Paisagem larga (expandido)
        const startW = this.isMobile ? Math.round(vw * 0.65) : 480;
        const startH = this.isMobile ? Math.round(vw * 0.37) : 270;
        const endW   = this.isMobile ? vw * 0.88 : Math.min(vw * 0.95, 1600);
        const endH   = this.isMobile ? Math.min(vh * 0.72, 700) : Math.min(vh * 0.88, 900);

        const mediaWidth   = startW + this.scrollProgress * (endW - startW);
        const mediaHeight  = startH + this.scrollProgress * (endH - startH);
        const borderRadius = 16 * (1 - this.scrollProgress);

        const textTranslateX      = this.scrollProgress * 150;
        const bgOpacity           = 1;
        const mediaOverlayOpacity = 0.5 - this.scrollProgress * 0.3;
        const contentOpacity      = this.showContent ? 1 : 0;

        // Actualizar media container
        if (this.elements.mediaContainer) {
            this.elements.mediaContainer.style.width        = `${Math.min(mediaWidth,  vw * 0.98)}px`;
            this.elements.mediaContainer.style.height       = `${Math.min(mediaHeight, vh * 0.92)}px`;
            this.elements.mediaContainer.style.borderRadius = `${borderRadius}px`;
        }

        // Actualizar background
        this.elements.bgLayer.style.opacity = bgOpacity;

        // Actualizar texto
        if (this.elements.titleFirst) {
            this.elements.titleFirst.style.transform = `translateX(-${textTranslateX}vw)`;
        }
        if (this.elements.titleRest) {
            this.elements.titleRest.style.transform = `translateX(${textTranslateX}vw)`;
        }

        // Actualizar scroll indicator
        this.elements.scrollIndicator.style.opacity   = 1 - this.scrollProgress * 2;
        this.elements.scrollIndicator.style.transform = `translateY(${this.scrollProgress * 50}px)`;

        // Actualizar media overlay
        if (this.elements.mediaContainer) {
            const mediaOverlay = this.elements.mediaContainer.querySelector('.hero-media-overlay');
            if (mediaOverlay) {
                mediaOverlay.style.opacity = mediaOverlayOpacity;
            }
        }

        // Actualizar content section
        this.elements.contentSection.style.opacity      = contentOpacity;
        this.elements.contentSection.style.pointerEvents = this.showContent ? 'auto' : 'none';
    }

    reset() {
        this.scrollProgress = 0;
        this.targetProgress = 0;
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

        if (this._visibilityObserver) {
            this._visibilityObserver.disconnect();
            this._visibilityObserver = null;
        }
    }
}

// Initialize quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se existe o elemento hero
    if (document.getElementById('hero')) {
        // Inicializar com as configurações do GIDE Paisagismo
        window.scrollExpansionHero = new ScrollExpansionHero({
            mediaType: 'video',
            mediaSrc: 'heroGide.mp4',
            bgImageSrc: 'plantasgide.jpeg',
            bgVideoSrc: 'images/Whisk_gdz4edn3qtywetnk1so2cjytudzkrtlhdto20cn.mp4',
            posterSrc: 'plantasgide.jpeg',
            title: 'GIDE PAISAGISMO',
            subtitle: 'Paisagismo sob medida para jardins, empresas e eventos',
            scrollToExpand: 'Role para explorar',
            textBlend: true
        });
    }
});

// Export para uso externo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollExpansionHero;
}
