/* ==========================================
   GIDI Paisagismo — premium.js
   FAQ accordion + stagger grids
   ========================================== */

(function () {
    'use strict';

    /* ------------------------------------------
       1. FAQ ACCORDION
    ------------------------------------------ */
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        var btn = item.querySelector('.faq-question');
        if (!btn) return;

        btn.addEventListener('click', function () {
            var wasOpen = item.classList.contains('is-open');

            /* Close all */
            faqItems.forEach(function (i) {
                i.classList.remove('is-open');
                var q = i.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            /* Open clicked if it was closed */
            if (!wasOpen) {
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ------------------------------------------
       3. STAGGER ANIMATION ON GRID ENTRY
    ------------------------------------------ */
    var staggerGrids = document.querySelectorAll('.servicos-grid, .processo-grid');

    if (!staggerGrids.length) return;

    var staggerObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                Array.from(entry.target.children).forEach(function (el, i) {
                    el.style.transitionDelay = (i * 60) + 'ms';
                    el.classList.add('stagger-visible');
                });
                staggerObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    staggerGrids.forEach(function (g) { staggerObs.observe(g); });

}());
