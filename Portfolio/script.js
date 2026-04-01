/**
 * Portfolio — script.js
 *
 * Interactive features:
 *   1. Hamburger menu (button injected via JS, not hardcoded in HTML)
 *   2. Scroll animations (fade-in + slide-up via IntersectionObserver)
 *   3. Active nav link highlight (IntersectionObserver on sections)
 *   4. Animated counters (stat numbers count up from 0)
 *
 * Vanilla JS only — no frameworks, no external dependencies.
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. HAMBURGER MENU
    // =========================================================================
    //
    // Creates the toggle button dynamically, appends it to .nav-container,
    // and animates the nav-links slide in/out via the .is-open class.

    /**
     * Build and inject the hamburger <button> into the nav container.
     * Binds click and close-on-link-click events.
     *
     * @returns {void}
     */
    function initHamburgerMenu() {
        var navContainer = document.querySelector('.nav-container');
        var navMenu      = document.getElementById('nav-menu');

        if (!navContainer || !navMenu) {
            return;
        }

        // Build button with three animated bars
        var btn = document.createElement('button');
        btn.className = 'nav-toggle';
        btn.id        = 'nav-toggle';
        btn.setAttribute('aria-label',    'Ouvrir le menu');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'nav-menu');
        btn.setAttribute('type',          'button');

        for (var i = 0; i < 3; i++) {
            var bar = document.createElement('span');
            bar.className = 'hamburger-bar';
            btn.appendChild(bar);
        }

        navContainer.appendChild(btn);

        // Toggle open / close
        btn.addEventListener('click', function () {
            var isOpen = navMenu.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close when any navigation link is clicked
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('is-open');
                btn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // =========================================================================
    // 2. SCROLL ANIMATIONS
    // =========================================================================
    //
    // Targets: .stat-box, .skill-category, .project-card,
    //          .timeline-item, .comparison-card
    //
    // Elements that already have .reveal in the HTML keep it.
    // Elements that don't have it receive it programmatically so the
    // same CSS transition pair (opacity + transform) handles everything.
    // Stagger delays are applied to grid siblings for a cascading effect.

    /** Selectors that must animate on scroll. */
    var SCROLL_ANIMATED_SELECTORS = [
        '.stat-box',
        '.skill-category',
        '.project-card',
        '.timeline-item',
        '.comparison-card'
    ];

    /**
     * Ensure every targeted element carries the .reveal class so the
     * IntersectionObserver can handle it uniformly.
     *
     * @returns {void}
     */
    function addRevealClasses() {
        SCROLL_ANIMATED_SELECTORS.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (el) {
                if (!el.classList.contains('reveal')) {
                    el.classList.add('reveal');
                }
            });
        });
    }

    /**
     * Add progressive transition-delay to siblings inside skill
     * and project grids so they cascade in one after another.
     *
     * @returns {void}
     */
    function applyStaggerDelays() {
        var staggered = document.querySelectorAll(
            '.skills-grid .reveal, .projects-grid .reveal'
        );
        staggered.forEach(function (el, index) {
            el.style.transitionDelay = (index % 4 * 0.1) + 's';
        });
    }

    /**
     * Observe every .reveal element; add .visible when it enters
     * the viewport to trigger the CSS fade-in + slide-up transition.
     *
     * @returns {void}
     */
    function initScrollAnimations() {
        addRevealClasses();
        applyStaggerDelays();

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.reveal').forEach(function (el) {
            observer.observe(el);
        });
    }

    // =========================================================================
    // 3. ACTIVE NAV LINK
    // =========================================================================
    //
    // Uses a narrow IntersectionObserver band (-30% / -60%) so the active
    // state switches when the section title reaches the upper third of the
    // viewport — giving a natural feel regardless of section height.

    /**
     * Detect the current section on scroll and apply .active to the
     * corresponding nav link.
     *
     * @returns {void}
     */
    function initActiveNavLink() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) {
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    var targetId = entry.target.id;
                    navLinks.forEach(function (link) {
                        link.classList.toggle(
                            'active',
                            link.getAttribute('href') === '#' + targetId
                        );
                    });
                });
            },
            { rootMargin: '-30% 0px -60% 0px' }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    // =========================================================================
    // 4. ANIMATED COUNTERS
    // =========================================================================
    //
    // Parses the text of each .stat-number (e.g. "10+", "100%", "2"),
    // stores it in data-target, then animates from 0 to the numeric target
    // using requestAnimationFrame and a cubic ease-out curve.

    /**
     * Cubic ease-out easing function.
     *
     * @param   {number} t - Progress in [0, 1].
     * @returns {number}   - Eased value in [0, 1].
     */
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    /**
     * Animate a single counter element from 0 to its target value.
     *
     * @param {HTMLElement} el - The .stat-number element.
     * @returns {void}
     */
    function runCounter(el) {
        var original = el.getAttribute('data-target');
        var target   = parseInt(original, 10);
        var suffix   = original.replace(/^\d+/, ''); // "+", "%", or ""
        var duration = 1600;
        var startTs  = null;

        el.textContent = '0' + suffix;

        function tick(timestamp) {
            if (startTs === null) {
                startTs = timestamp;
            }

            var elapsed  = timestamp - startTs;
            var progress = Math.min(elapsed / duration, 1);
            var current  = Math.floor(easeOutCubic(progress) * target);

            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = original; // restore exact original string
            }
        }

        requestAnimationFrame(tick);
    }

    /**
     * Observe every .stat-number; trigger runCounter() once it enters
     * the viewport.
     *
     * @returns {void}
     */
    function initCounters() {
        var statNumbers = document.querySelectorAll('.stat-number');

        if (!statNumbers.length) {
            return;
        }

        // Cache original values before any counter animation modifies them
        statNumbers.forEach(function (el) {
            el.setAttribute('data-target', el.textContent.trim());
        });

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    runCounter(entry.target);
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.6 }
        );

        statNumbers.forEach(function (el) {
            observer.observe(el);
        });
    }

    // =========================================================================
    // SUPPORTING FEATURES
    // =========================================================================

    /**
     * Animate skill progress bars to their data-width value when the
     * parent .skill-category enters the viewport.
     *
     * @returns {void}
     */
    function initSkillBars() {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    entry.target.querySelectorAll('.skill-progress').forEach(function (bar) {
                        bar.style.width = (bar.dataset.width || 0) + '%';
                    });
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.2 }
        );

        document.querySelectorAll('.skill-category').forEach(function (cat) {
            observer.observe(cat);
        });
    }

    /**
     * Show/hide the scroll-to-top button and handle its click.
     *
     * @returns {void}
     */
    function initScrollToTop() {
        var btn = document.getElementById('scroll-top');

        if (!btn) {
            return;
        }

        window.addEventListener(
            'scroll',
            function () {
                btn.classList.toggle('visible', window.scrollY > 500);
            },
            { passive: true }
        );

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /**
     * Add .scrolled to #navbar after the user scrolls past the hero,
     * increasing the background opacity and adding a shadow.
     *
     * @returns {void}
     */
    function initNavbarScrollEffect() {
        var navbar = document.getElementById('navbar');

        if (!navbar) {
            return;
        }

        window.addEventListener(
            'scroll',
            function () {
                navbar.classList.toggle('scrolled', window.scrollY > 20);
            },
            { passive: true }
        );
    }

    /**
     * Handle the contact form submission: open a pre-filled mailto link,
     * display a success message, and reset the form after 4 seconds.
     *
     * @returns {void}
     */
    function initContactForm() {
        var form      = document.getElementById('contact-form');
        var feedback  = document.getElementById('form-feedback');

        if (!form || !feedback) {
            return;
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var submitBtn      = form.querySelector('button[type="submit"]');
            var originalLabel  = submitBtn.innerHTML;

            var subject = encodeURIComponent(
                document.getElementById('subject').value
            );
            var body = encodeURIComponent(
                'De\u00a0: ' +
                document.getElementById('name').value +
                ' (' + document.getElementById('email').value + ')\n\n' +
                document.getElementById('message').value
            );

            window.location.href =
                'mailto:leo.leseigneur@orange.fr' +
                '?subject=' + subject +
                '&body='    + body;

            submitBtn.disabled   = true;
            submitBtn.textContent = 'Message pr\u00eat \u2713';

            feedback.textContent = 'Votre client mail va s\u2019ouvrir avec le message pr\u00e9-rempli. Merci\u00a0!';
            feedback.className   = 'form-feedback-success';

            setTimeout(function () {
                form.reset();
                submitBtn.disabled  = false;
                submitBtn.innerHTML = originalLabel;
                feedback.className  = '';
                feedback.textContent = '';
            }, 4000);
        });
    }

    // =========================================================================
    // INIT
    // =========================================================================

    document.addEventListener('DOMContentLoaded', function () {
        initHamburgerMenu();
        initNavbarScrollEffect();
        initScrollAnimations();
        initActiveNavLink();
        initCounters();
        initSkillBars();
        initScrollToTop();
        initContactForm();
    });

}());

// =========================================================================
// FEATURE: DARK / LIGHT MODE TOGGLE
// =========================================================================

// Apply stored preference immediately (before paint) to prevent FOUC
(function () {
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
}());

/**
 * Inject a sun/moon toggle button into the nav container,
 * apply the stored theme on load, and persist preference in localStorage.
 *
 * @returns {void}
 */
function initThemeToggle() {
    var navContainer = document.querySelector('.nav-container');
    if (!navContainer) { return; }

    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.id        = 'theme-toggle';
    btn.setAttribute('aria-label',  'Basculer le th\u00e8me clair/sombre');
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('type',         'button');

    var isLight = document.body.classList.contains('light-mode');

    function applyTheme(light) {
        document.body.classList.toggle('light-mode', light);
        btn.textContent = light ? '\uD83C\uDF19' : '\u2600\uFE0F'; // 🌙 or ☀️
        btn.setAttribute('aria-pressed', light ? 'true' : 'false');
    }

    applyTheme(isLight);
    navContainer.appendChild(btn);

    btn.addEventListener('click', function () {
        isLight = !isLight;
        applyTheme(isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

document.addEventListener('DOMContentLoaded', initThemeToggle);

// =========================================================================
// FEATURE: TYPING EFFECT ON HERO TITLE
// =========================================================================

/**
 * Clear the hero <h1> content and retype it character by character at
 * ~80 ms/char, preserving the .text-gradient span around "Léo".
 * Runs once on load — no loop.
 *
 * @returns {void}
 */
function initTypingEffect() {
    var h1 = document.querySelector('#accueil .hero-title');
    if (!h1) { return; }

    var SPEED = 80; // ms per character

    // The two parts of the title and their styles
    var parts = [
        { text: 'Leseigneur ',    cls: null },
        { text: 'L\u00e9o',      cls: 'text-gradient' } // Léo
    ];

    // Clear the heading and place a blinking cursor
    h1.innerHTML = '';
    var cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    h1.appendChild(cursor);

    var partIdx     = 0;
    var charIdx     = 0;
    var currentNode = null;

    function typeNext() {
        if (partIdx >= parts.length) {
            // Typing complete — fade cursor out after a pause
            setTimeout(function () {
                cursor.classList.add('typing-cursor--done');
            }, 800);
            return;
        }

        var part = parts[partIdx];

        // First character of a new part — create the target node
        if (charIdx === 0) {
            if (part.cls) {
                currentNode = document.createElement('span');
                currentNode.className = part.cls;
            } else {
                currentNode = document.createTextNode('');
            }
            h1.insertBefore(currentNode, cursor);
        }

        // Append one character
        if (part.cls) {
            currentNode.textContent += part.text[charIdx];
        } else {
            currentNode.nodeValue += part.text[charIdx];
        }

        charIdx++;

        if (charIdx >= part.text.length) {
            partIdx++;
            charIdx     = 0;
            currentNode = null;
        }

        setTimeout(typeNext, SPEED);
    }

    // Wait for hero CSS animations to complete before starting
    setTimeout(typeNext, 600);
}

document.addEventListener('DOMContentLoaded', initTypingEffect);
