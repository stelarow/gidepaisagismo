/* ===================================
   GIDI Paisagismo - Animations JavaScript
   =================================== */

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    initializeAOS();
    initializeParallax();
});

/* ===================================
   AOS Initialization
   =================================== */
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 700,
            easing: 'ease-out',
            once: true,
            offset: 100,
            delay: 0,
            disable: function() {
                // Disable on mobile if performance is an issue
                return window.innerWidth < 768 && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            }
        });

        // Refresh AOS on window resize
        window.addEventListener('resize', debounceAOS(function() {
            AOS.refresh();
        }, 250));
    }
}

/* ===================================
   Swiper Carousel for Depoimentos
   (removido — seção usa scroll infinito CSS)
   =================================== */
// function initializeSwiperCarousel() { ... }

/* ===================================
   Parallax Effect
   =================================== */
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax, .hero');

    if (parallaxElements.length === 0) return;

    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    // Check if device supports parallax
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
        // Disable parallax on touch devices for better performance
        parallaxElements.forEach(el => {
            el.style.backgroundAttachment = 'scroll';
        });
        return;
    }

    window.addEventListener('scroll', throttleParallax(function() {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.dataset.parallaxSpeed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.backgroundPosition = `center ${yPos}px`;
        });
    }, 10));
}

/* ===================================
   Scroll Reveal Animations
   =================================== */
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

/* ===================================
   Typed Text Effect (Optional Enhancement)
   =================================== */
function typedTextEffect(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    const typing = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, speed);
}

/* ===================================
   Fade In Elements on Scroll
   =================================== */
const fadeElements = document.querySelectorAll('.fade-in-on-scroll');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-active');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
});

fadeElements.forEach(element => {
    fadeObserver.observe(element);
});

/* ===================================
   Stagger Animation for Lists
   =================================== */
function staggerAnimation(selector, delay = 100) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * delay}ms`;
    });
}

// Apply stagger to service cards and portfolio items
document.addEventListener('DOMContentLoaded', function() {
    staggerAnimation('.service-card', 100);
    staggerAnimation('.portfolio-item', 80);
});

/* ===================================
   Smooth Number Counter Animation
   =================================== */
function animateValue(element, start, end, duration) {
    if (!element) return;

    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ===================================
   Hover Card Tilt Effect (Optional)
   =================================== */
function initializeCardTilt() {
    const cards = document.querySelectorAll('.service-card, .depoimento-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
}

function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
}

function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
}

// Uncomment to enable tilt effect
// initializeCardTilt();

/* ===================================
   Background Animation (Floating Particles)
   =================================== */
function createFloatingParticles(containerId, particleCount = 20) {
    const container = document.getElementById(containerId);
    if (!container) return;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
}

/* ===================================
   Image Load Fade In
   =================================== */
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
});

/* ===================================
   Scroll Progress Bar
   =================================== */
function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, #2d5f3f, #78b719);
        width: 0%;
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Uncomment to enable scroll progress bar
// createScrollProgressBar();

/* ===================================
   View Transition API (Modern Browsers)
   =================================== */
function supportsViewTransitions() {
    return 'startViewTransition' in document;
}

function performViewTransition(callback) {
    if (supportsViewTransitions()) {
        document.startViewTransition(callback);
    } else {
        callback();
    }
}

/* ===================================
   Utility Functions
   =================================== */
function debounceAOS(func, wait) {
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

function throttleParallax(func, limit) {
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

/* ===================================
   Export for use in other modules
   =================================== */
window.GIDIAnimations = {
    typedTextEffect,
    animateValue,
    staggerAnimation,
    createFloatingParticles,
    performViewTransition
};
