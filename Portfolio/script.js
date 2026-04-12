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

        // Close when clicking outside the nav
        document.addEventListener('click', function (e) {
            if (navMenu.classList.contains('is-open') &&
                !navMenu.contains(e.target) &&
                !btn.contains(e.target)) {
                navMenu.classList.remove('is-open');
                btn.setAttribute('aria-expanded', 'false');
            }
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
        const backToTop = document.createElement('button');
        backToTop.id = 'back-to-top';
        backToTop.setAttribute('type', 'button');
        backToTop.setAttribute('aria-label', 'Retour en haut de page');
        backToTop.textContent = '↑';
        document.body.appendChild(backToTop);

        window.addEventListener('scroll', () => {
            backToTop.style.opacity = window.scrollY > 300 ? '1' : '0';
            backToTop.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none';
        });

        function smoothScrollToTop(duration) {
            const scrollingElement = document.scrollingElement || document.documentElement;
            const start = scrollingElement.scrollTop;
            const startTime = performance.now();

            function step(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 4);
                scrollingElement.scrollTop = start * (1 - ease);
                if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
        }

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            smoothScrollToTop(800);
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
        var form    = document.getElementById('contact-form');
        var feedback = document.getElementById('form-feedback');
        var overlay  = document.getElementById('terms-modal');

        if (!form || !feedback) { return; }

        var modalSource = null;

        function closeModal() {
            if (!overlay) { return; }
            overlay.classList.remove('terms-open');
            overlay.setAttribute('aria-hidden', 'true');
            modalSource = null;
        }

        function openModal(source) {
            if (!overlay) { return; }
            modalSource = source;

            var actions = overlay.querySelector('.terms-actions');
            if (source === 'footer') {
                actions.innerHTML =
                    '<button type="button" class="btn btn-primary terms-btn-action">Fermer</button>';
            } else {
                actions.innerHTML =
                    '<button type="button" class="btn btn-primary terms-btn-action">J\u2019accepte</button>' +
                    '<button type="button" class="btn btn-outline terms-btn-close">Refuser</button>';
            }

            overlay.classList.add('terms-open');
            overlay.setAttribute('aria-hidden', 'false');
            var firstBtn = actions.querySelector('button');
            if (firstBtn) { firstBtn.focus(); }
        }

        function doSubmit() {
            var submitBtn     = form.querySelector('button[type="submit"]');
            var originalLabel = submitBtn.innerHTML;
            var formGroups    = form.querySelectorAll('.form-group');

            var subject = encodeURIComponent(document.getElementById('subject').value);
            var body    = encodeURIComponent(
                'De\u00a0: ' +
                document.getElementById('name').value +
                ' (' + document.getElementById('email').value + ')\n\n' +
                document.getElementById('message').value
            );

            window.location.href =
                'mailto:leo.leseigneur@orange.fr?subject=' + subject + '&body=' + body;

            formGroups.forEach(function (g) { g.style.display = 'none'; });
            submitBtn.style.display = 'none';

            feedback.innerHTML  = '\u2705 Message envoy\u00e9\u00a0! Je vous r\u00e9pondrai dans les plus brefs d\u00e9lais.';
            feedback.className  = 'form-feedback-success form-feedback-prominent';

            setTimeout(function () {
                form.reset();
                formGroups.forEach(function (g) { g.style.display = ''; });
                submitBtn.style.display  = '';
                submitBtn.disabled       = false;
                submitBtn.innerHTML      = originalLabel;
                feedback.className       = '';
                feedback.textContent     = '';
            }, 5000);
        }

        // ── Validation ───────────────────────────────────────────────────
        function showError(fieldId, msg) {
            var field = document.getElementById(fieldId);
            if (!field) { return; }
            var err = document.createElement('span');
            err.className   = 'field-error';
            err.textContent = msg;
            field.parentNode.appendChild(err);
            field.setAttribute('aria-invalid', 'true');
            field.style.borderColor = '#ef4444';
            field.classList.add('field-shake');
            setTimeout(function () { field.classList.remove('field-shake'); }, 600);
        }

        function clearErrors() {
            form.querySelectorAll('.field-error').forEach(function (el) { el.remove(); });
            form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
            form.querySelectorAll('input, textarea').forEach(function (el) { el.style.borderColor = ''; });
        }

        function validate() {
            clearErrors();
            var valid   = true;
            var name    = document.getElementById('name').value.trim();
            var email   = document.getElementById('email').value.trim();
            var subject = document.getElementById('subject').value.trim();
            var message = document.getElementById('message').value.trim();

            if (name.length < 2) {
                showError('name', 'Minimum 2 caract\u00e8res.');
                valid = false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
                showError('email', 'Adresse email invalide.');
                valid = false;
            }
            if (subject.length < 3) {
                showError('subject', 'Minimum 3 caract\u00e8res.');
                valid = false;
            }
            if (message.length < 10) {
                showError('message', 'Minimum 10 caract\u00e8res.');
                valid = false;
            } else if (message.length > 2000) {
                showError('message', 'Maximum 2000 caract\u00e8res.');
                valid = false;
            }
            return valid;
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (validate()) { openModal('form'); }
        });

        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) { closeModal(); return; }
                if (e.target.classList.contains('terms-btn-close')) { closeModal(); return; }
                if (e.target.classList.contains('terms-btn-action')) {
                    var shouldSubmit = (modalSource === 'form');
                    closeModal();
                    if (shouldSubmit) { doSubmit(); }
                    return;
                }
            });
        }

        // Footer "Conditions d'utilisation" link
        var cgLink = document.getElementById('terms-link');
        if (cgLink) {
            cgLink.addEventListener('click', function (e) {
                e.preventDefault();
                openModal('footer');
            });
        }

        // ── Char counter ─────────────────────────────────────────────────
        var msgArea = document.getElementById('message');
        if (msgArea) {
            var counter = document.createElement('div');
            counter.className   = 'char-counter';
            counter.textContent = '0 / 2000 caract\u00e8res';
            msgArea.parentNode.insertBefore(counter, msgArea.nextSibling);

            msgArea.addEventListener('input', function () {
                var len = msgArea.value.length;
                counter.textContent = len + ' / 2000 caract\u00e8res';
                counter.classList.toggle('char-counter-danger', len > 1800);
            });
        }
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
        btn.setAttribute('aria-label', light ? 'Activer le mode nuit' : 'Activer le mode jour');
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

    var parts = [
        { text: 'Leseigneur ',    cls: null },
        { text: 'L\u00e9o',      cls: 'text-gradient' } // Léo
    ];

    var SPEED = 80; // ms per character

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

// =========================================================================
// FEATURE: TOOLTIPS ON PROJECT TAGS
// =========================================================================

/** Short descriptions keyed by tag text content. */
var TAG_DESCRIPTIONS = {
    'Linux':      'Syst\u00e8me d\'exploitation open source',
    'Apache':     'Serveur web HTTP / HTTPS',
    'Bash':       'Scripting shell Unix/Linux',
    'SSL':        'Chiffrement et certificats HTTPS',
    'VMware':     'Hyperviseur de virtualisation',
    'R\u00e9seau': 'Configuration LAN / WAN',
    'pfSense':    'Pare-feu BSD open source',
    'VLAN':       'Segmentation r\u00e9seau logique',
    'Python':     'Langage de programmation polyvalent',
    'TI-Python':  'Python embarqu\u00e9 sur calculatrice TI',
    'JSON':       'Format d\'échange de donn\u00e9es l\u00e9ger',
    'C#':         'Langage orient\u00e9 objet Microsoft',
    '.NET':       'Framework applicatif Microsoft',
    'Debugging':  'Analyse et correction de bugs',
    'Kali Linux': 'Distribution Linux pour le pentesting',
    'Nmap':       'Scanner de ports et d\'h\u00f4tes r\u00e9seau',
    'Pentesting': 'Tests d\'intrusion autoris\u00e9s',
    'HTML/CSS':   'Langages de structure et de style web',
    'o2switch':   'H\u00e9bergement mutualis\u00e9 fran\u00e7ais',
    'JavaScript': 'Langage de script c\u00f4t\u00e9 client',
    'PHP':        'Langage de script c\u00f4t\u00e9 serveur',
    'MySQL':      'Syst\u00e8me de gestion de base de donn\u00e9es',
    'Git':              'Logiciel de gestion de versions',
    'Docker':           'Plateforme de conteneurisation',
    'Active Directory': 'Service d\'annuaire Microsoft',
    'Windows Server':   'Syst\u00e8me d\'exploitation serveur Microsoft',
    'GPO':              'Group Policy Object \u2014 Strat\u00e9gies de groupes',
    'DNS':              'Domain Name System \u2014 R\u00e9solution de noms'
};

/**
 * Create a single global #global-tooltip element on <body> and attach
 * mouseenter/mouseleave/touchstart listeners to every .tag whose text
 * matches TAG_DESCRIPTIONS. The tooltip is positioned via fixed coordinates
 * so it is never clipped by card overflow.
 *
 * @returns {void}
 */
function initTagTooltips() {
    // Single global tooltip on <body> — never clipped by card overflow
    var tip = document.createElement('div');
    tip.id = 'global-tooltip';
    tip.setAttribute('role', 'tooltip');
    tip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tip);

    var hideTimer = null;

    function showTip(tag) {
        var desc = TAG_DESCRIPTIONS[tag.textContent.trim()];
        if (!desc) { return; }

        clearTimeout(hideTimer);
        tip.textContent = desc;
        tip.classList.add('visible');

        // Position above the tag using fixed coordinates
        var r        = tag.getBoundingClientRect();
        var tipW     = tip.offsetWidth;
        var tipH     = tip.offsetHeight;
        var left     = r.left + r.width / 2 - tipW / 2;
        var top      = r.top  - tipH - 10;

        // Clamp horizontally; flip below if not enough space above
        left = Math.max(8, Math.min(left, window.innerWidth - tipW - 8));
        if (top < 8) { top = r.bottom + 10; }

        tip.style.left = left + 'px';
        tip.style.top  = top  + 'px';
    }

    function hideTip() { tip.classList.remove('visible'); }

    document.querySelectorAll('.tag').forEach(function (tag) {
        var desc = TAG_DESCRIPTIONS[tag.textContent.trim()];
        if (!desc) { return; }

        tag.setAttribute('data-tooltip', desc);

        tag.addEventListener('mouseenter', function () { showTip(tag); });
        tag.addEventListener('mouseleave', hideTip);

        // Mobile: show on tap, auto-hide after 1.5 s
        tag.addEventListener('touchstart', function (e) {
            e.preventDefault();
            showTip(tag);
            clearTimeout(hideTimer);
            hideTimer = setTimeout(hideTip, 1500);
        }, { passive: false });
    });
}

document.addEventListener('DOMContentLoaded', initTagTooltips);

// =========================================================================
// FEATURE: PARTICLE BACKGROUND ON #accueil
// =========================================================================

/**
 * Inject a <canvas> as the first child of #accueil and animate ~80 particles
 * that drift slowly and connect with faint lines when closer than 120 px.
 * The canvas resizes on window resize and never blocks the main thread
 * (pure requestAnimationFrame loop).
 *
 * @returns {void}
 */
function initParticles() {
    var section = document.getElementById('accueil');
    if (!section || !window.requestAnimationFrame) { return; }

    var canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    section.insertBefore(canvas, section.firstChild);

    // ── Mouse / touch tracking (on section, canvas has pointer-events:none) ──

    function canvasPos(clientX, clientY) {
        var r = canvas.getBoundingClientRect();
        return { x: clientX - r.left, y: clientY - r.top };
    }

    function spawnBurst(cx, cy) {
        var n = 8 + Math.floor(Math.random() * 5);
        for (var i = 0; i < n; i++) {
            var angle = (i / n) * Math.PI * 2;
            var speed = rand(1.5, 3.5);
            bursts.push({
                x: cx, y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                r: rand(2, 4)
            });
        }
    }

    section.addEventListener('mousemove', function (e) {
        var p = canvasPos(e.clientX, e.clientY);
        mouseX = p.x; mouseY = p.y;
    }, { passive: true });

    section.addEventListener('mouseleave', function () {
        mouseX = -9999; mouseY = -9999;
    });

    section.addEventListener('click', function (e) {
        var p = canvasPos(e.clientX, e.clientY);
        spawnBurst(p.x, p.y);
    });

    section.addEventListener('touchmove', function (e) {
        var t = e.touches[0];
        var p = canvasPos(t.clientX, t.clientY);
        mouseX = p.x; mouseY = p.y;
    }, { passive: true });

    section.addEventListener('touchstart', function (e) {
        var t = e.touches[0];
        var p = canvasPos(t.clientX, t.clientY);
        mouseX = p.x; mouseY = p.y;
        spawnBurst(p.x, p.y);
    }, { passive: true });

    section.addEventListener('touchend', function () {
        mouseX = -9999; mouseY = -9999;
    }, { passive: true });

    var ctx      = canvas.getContext('2d');
    var pts      = [];
    var COUNT    = 80;
    var MAX_DIST = 120;
    var raf      = null;
    var mouseX   = -9999;
    var mouseY   = -9999;
    var bursts   = [];
    var REPEL_R  = 150;

    function rand(a, b) { return a + Math.random() * (b - a); }

    function makePt() {
        return {
            x:  rand(0, canvas.width),
            y:  rand(0, canvas.height),
            vx: rand(-0.35, 0.35),
            vy: rand(-0.35, 0.35),
            r:  rand(1.5, 2.5)
        };
    }

    function init() {
        canvas.width  = section.offsetWidth;
        canvas.height = section.offsetHeight;
        pts = [];
        for (var i = 0; i < COUNT; i++) { pts.push(makePt()); }
    }

    function frame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];

            // Repel from cursor
            var mdx = p.x - mouseX;
            var mdy = p.y - mouseY;
            var md  = Math.sqrt(mdx * mdx + mdy * mdy);
            if (md < REPEL_R && md > 0.5) {
                var force = (REPEL_R - md) / REPEL_R * 0.5;
                p.vx += (mdx / md) * force;
                p.vy += (mdy / md) * force;
                var spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (spd > 2) { p.vx = p.vx / spd * 2; p.vy = p.vy / spd * 2; }
            }

            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width)  { p.vx *= -1; }
            if (p.y < 0 || p.y > canvas.height) { p.vy *= -1; }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(96, 165, 250, 0.55)';
            ctx.fill();

            for (var j = i + 1; j < pts.length; j++) {
                var q    = pts[j];
                var dx   = p.x - q.x;
                var dy   = p.y - q.y;
                var dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = 'rgba(96, 165, 250, ' +
                        ((1 - dist / MAX_DIST) * 0.2).toFixed(3) + ')';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Animate burst particles (click / tap effect)
        for (var b = bursts.length - 1; b >= 0; b--) {
            var bp = bursts[b];
            bp.x     += bp.vx;
            bp.y     += bp.vy;
            bp.vx    *= 0.96;
            bp.vy    *= 0.96;
            bp.alpha -= 0.018;
            if (bp.alpha <= 0) { bursts.splice(b, 1); continue; }
            ctx.beginPath();
            ctx.arc(bp.x, bp.y, bp.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(96, 165, 250, ' + bp.alpha.toFixed(3) + ')';
            ctx.fill();
        }

        raf = requestAnimationFrame(frame);
    }

    init();
    frame();

    window.addEventListener('resize', function () {
        cancelAnimationFrame(raf);
        init();
        frame();
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initParticles);

// =========================================================================
// FEATURE: READING PROGRESS BAR
// =========================================================================

/**
 * Inject a fixed 3 px bar at the very top of the viewport (above the nav)
 * that fills left-to-right as the user scrolls the full page height.
 *
 * @returns {void}
 */
function initReadingProgressBar() {
    var bar = document.createElement('div');
    bar.id = 'reading-progress';
    bar.setAttribute('aria-hidden',    'true');
    bar.setAttribute('role',           'progressbar');
    bar.setAttribute('aria-valuemin',  '0');
    bar.setAttribute('aria-valuemax',  '100');
    bar.setAttribute('aria-valuenow',  '0');

    document.body.insertBefore(bar, document.body.firstChild);

    window.addEventListener('scroll', function () {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var maxScroll = document.documentElement.scrollHeight -
                        document.documentElement.clientHeight;
        var pct       = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        var clamped   = Math.min(pct, 100);

        bar.style.width = clamped.toFixed(1) + '%';
        bar.setAttribute('aria-valuenow', Math.round(clamped));
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initReadingProgressBar);

// =========================================================================
// FEATURE: GLITCH EFFECT ON HERO H1
// =========================================================================

/**
 * Trigger a 600 ms cyberpunk glitch animation on the hero <h1> via
 * CSS ::before/::after layers keyed off a data-text attribute.
 * Fires on mouseover (desktop) and touchstart (mobile).
 *
 * @returns {void}
 */
function initGlitchEffect() {
    var h1 = document.querySelector('#accueil .hero-title');
    if (!h1) { return; }

    var glitching = false;

    function triggerGlitch() {
        if (glitching) { return; }
        glitching = true;

        // Keep data-text in sync with current visible text
        h1.setAttribute('data-text', h1.textContent);
        h1.classList.add('glitching');

        setTimeout(function () {
            h1.classList.remove('glitching');
            glitching = false;
        }, 620);
    }

    h1.addEventListener('mouseover',   triggerGlitch);
    h1.addEventListener('touchstart',  triggerGlitch, { passive: true });
}

document.addEventListener('DOMContentLoaded', initGlitchEffect);

// =========================================================================
// FEATURE: 3D TILT ON .project-card
// =========================================================================

/**
 * Apply perspective tilt + moving shine on .project-card mousemove.
 * On touch: shows the shine briefly on touchstart, no tilt (avoids jank).
 * Resets smoothly on mouseleave.
 *
 * @returns {void}
 */
function initCardTilt() {
    var MAX_TILT = 4; // degrees
    var isTouchDevice = window.matchMedia('(hover: none)').matches;

    document.querySelectorAll('.project-card').forEach(function (card) {
        // Inject shine overlay
        var shine = document.createElement('div');
        shine.className = 'card-shine';
        card.appendChild(shine);

        if (isTouchDevice) {
            // Touch: flash shine, no tilt
            card.addEventListener('touchstart', function () {
                shine.style.opacity = '1';
                setTimeout(function () { shine.style.opacity = ''; }, 400);
            }, { passive: true });
            return;
        }

        card.addEventListener('mousemove', function (e) {
            var rect    = card.getBoundingClientRect();
            var cx      = rect.left + rect.width  / 2;
            var cy      = rect.top  + rect.height / 2;
            var dx      = (e.clientX - cx) / (rect.width  / 2); // -1..1
            var dy      = (e.clientY - cy) / (rect.height / 2); // -1..1
            var rotY    =  dx * MAX_TILT;
            var rotX    = -dy * MAX_TILT;

            card.style.transition = 'transform 0.1s ease, box-shadow var(--t)';
            card.style.transform  =
                'perspective(800px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(1.02)';

            // Move shine to follow cursor
            var pctX = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
            var pctY = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
            shine.style.background =
                'radial-gradient(circle at ' + pctX + '% ' + pctY + '%, ' +
                'rgba(255,255,255,0.056) 0%, transparent 55%)';
        });

        card.addEventListener('mouseleave', function () {
            card.style.transition = 'transform 0.5s ease, box-shadow var(--t)';
            card.style.transform  = '';
            shine.style.background = '';
        });
    });
}

document.addEventListener('DOMContentLoaded', initCardTilt);

// =========================================================================
// FEATURE: SCRAMBLE TEXT ON SECTION TITLES
// =========================================================================

/**
 * When a .section-header h2 enters the viewport, scramble its letters
 * for 800 ms using random chars, then resolve left-to-right to the real text.
 * Triggered once per element.
 *
 * @returns {void}
 */
function initScrambleText() {
    var CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    var DURATION = 800;  // ms total scramble phase
    var STEP_MS  = 40;   // repaint interval

    function randChar() {
        return CHARSET[Math.floor(Math.random() * CHARSET.length)];
    }

    function scramble(el) {
        var original = el.textContent;
        var length   = original.length;
        var resolved = 0;
        var elapsed  = 0;
        var resolveInterval = DURATION / length; // ms per resolved char

        var timer = setInterval(function () {
            elapsed += STEP_MS;
            resolved = Math.floor(elapsed / resolveInterval);
            if (resolved >= length) { resolved = length; }

            var out = '';
            for (var i = 0; i < length; i++) {
                if (i < resolved) {
                    out += original[i];              // resolved character
                } else if (original[i] === ' ') {
                    out += ' ';                      // preserve spaces
                } else {
                    out += randChar();               // scrambled character
                }
            }
            el.textContent = out;

            if (resolved >= length) {
                clearInterval(timer);
                el.textContent = original;           // guarantee exact restore
            }
        }, STEP_MS);
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) { return; }
            scramble(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.section-header h2').forEach(function (h2) {
        observer.observe(h2);
    });
}

document.addEventListener('DOMContentLoaded', initScrambleText);

// =========================================================================
// FEATURE: LIVE CLOCK IN FOOTER
// =========================================================================

/**
 * Inject a live HH:MM:SS clock + French date into the footer,
 * updating every second via setInterval.
 *
 * @returns {void}
 */
function initLiveClock() {
    var footer = document.querySelector('footer .footer-inner');
    if (!footer) { return; }

    var DAYS   = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
    var MONTHS = ['janvier','f\u00e9vrier','mars','avril','mai','juin',
                  'juillet','ao\u00fbt','septembre','octobre','novembre','d\u00e9cembre'];

    var wrap = document.createElement('div');
    wrap.className = 'footer-clock';

    var timeEl = document.createElement('div');
    timeEl.className = 'footer-clock-time';

    var dateEl = document.createElement('div');

    wrap.appendChild(timeEl);
    wrap.appendChild(dateEl);
    footer.appendChild(wrap);

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function tick() {
        var tz  = localStorage.getItem('preferred_timezone') || undefined;
        var now = new Date();

        var timeOpts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        var dateOpts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        if (tz) { timeOpts.timeZone = tz; dateOpts.timeZone = tz; }

        var tp = new Intl.DateTimeFormat('fr-FR', timeOpts).formatToParts(now);
        var h  = tp.find(function (p) { return p.type === 'hour';   }).value;
        var m  = tp.find(function (p) { return p.type === 'minute'; }).value;
        var s  = tp.find(function (p) { return p.type === 'second'; }).value;
        timeEl.textContent = h + ':' + m + ':' + s;

        var dp     = new Intl.DateTimeFormat('fr-FR', dateOpts).formatToParts(now);
        var dayStr = dp.find(function (p) { return p.type === 'weekday'; }).value;
        var dateNum= dp.find(function (p) { return p.type === 'day';     }).value;
        var monStr = dp.find(function (p) { return p.type === 'month';   }).value;
        var yr     = dp.find(function (p) { return p.type === 'year';    }).value;
        dayStr = dayStr.charAt(0).toUpperCase() + dayStr.slice(1);
        monStr = monStr.charAt(0).toUpperCase() + monStr.slice(1);
        dateEl.textContent = dayStr + ' ' + dateNum + ' ' + monStr + ' ' + yr;
    }

    tick();
    setInterval(tick, 1000);
}

document.addEventListener('DOMContentLoaded', initLiveClock);

// =========================================================================
// FEATURE: MATRIX RAIN EASTER EGG
// =========================================================================

/**
 * Launch a full-screen Matrix rain effect:
 *   Desktop : Konami code  ↑↑↓↓←→←→BA
 *   Mobile  : triple-tap the .nav-brand within 1 second
 * Plays for 4 s then fades out.
 * A synthetic Web Audio beep fires on trigger (no external files).
 *
 * @returns {void}
 */
function initMatrixEasterEgg() {
    var CHARS = '\u30A1\u30A2\u30A3\u30A4\u30A5\u30A6\u30A7\u30A8\u30A9\u30AA' +
                '\u30AB\u30AC\u30AD\u30AE\u30AF\u30B0\u30B1\u30B2\u30B3\u30B4' +
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    // ── Konami code detector ──────────────────────────────────────────────
    var KONAMI  = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var konamiIdx = 0;

    document.addEventListener('keydown', function (e) {
        if (e.keyCode === KONAMI[konamiIdx]) {
            konamiIdx++;
            if (konamiIdx === KONAMI.length) { konamiIdx = 0; launchMatrix(); }
        } else {
            konamiIdx = 0;
        }
    });

    // ── Triple-tap on nav-brand (mobile) ──────────────────────────────────
    var brand    = document.querySelector('.nav-brand');
    var tapCount = 0;
    var tapTimer = null;

    if (brand) {
        brand.addEventListener('touchstart', function (e) {
            e.preventDefault();
            tapCount++;
            clearTimeout(tapTimer);
            tapTimer = setTimeout(function () { tapCount = 0; }, 1000);
            if (tapCount >= 3) { tapCount = 0; launchMatrix(); }
        }, { passive: false });
    }

    // ── Beep via Web Audio API ────────────────────────────────────────────
    function playBeep() {
        try {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) { return; }
            var ctx  = new AudioCtx();
            var osc  = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
        } catch (err) { /* AudioContext blocked — silent fallback */ }
    }

    // ── Matrix canvas renderer ────────────────────────────────────────────
    function launchMatrix() {
        if (document.getElementById('matrix-overlay')) { return; } // already running

        playBeep();

        var overlay = document.createElement('div');
        overlay.id = 'matrix-overlay';

        var cvs = document.createElement('canvas');
        cvs.id  = 'matrix-canvas';
        overlay.appendChild(cvs);

        var msg = document.createElement('div');
        msg.id  = 'matrix-message';
        msg.textContent = 'ACC\u00c8S AUTORIS\u00c9';   // ACCÈS AUTORISÉ
        overlay.appendChild(msg);

        document.body.appendChild(overlay);

        // Force reflow then fade in
        overlay.getBoundingClientRect();
        overlay.classList.add('matrix-visible');

        var ctx  = cvs.getContext('2d');
        var W, H, cols, drops;
        var FONT = 14;
        var raf2 = null;

        function resize() {
            W = cvs.width  = window.innerWidth;
            H = cvs.height = window.innerHeight;
            cols  = Math.floor(W / FONT);
            drops = [];
            for (var i = 0; i < cols; i++) {
                drops[i] = Math.floor(Math.random() * -H / FONT);
            }
        }

        function drawFrame() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#00ff41';
            ctx.font      = FONT + 'px monospace';

            for (var c = 0; c < cols; c++) {
                var ch = CHARS[Math.floor(Math.random() * CHARS.length)];
                ctx.fillText(ch, c * FONT, drops[c] * FONT);
                if (drops[c] * FONT > H && Math.random() > 0.975) {
                    drops[c] = 0;
                }
                drops[c]++;
            }
            raf2 = requestAnimationFrame(drawFrame);
        }

        resize();
        drawFrame();

        // Click / tap to dismiss early
        overlay.addEventListener('click',      dismiss);
        overlay.addEventListener('touchstart', dismiss, { passive: true });

        // Auto-dismiss after 4 s
        var autoTimer = setTimeout(dismiss, 4000);

        function dismiss() {
            clearTimeout(autoTimer);
            cancelAnimationFrame(raf2);
            overlay.classList.remove('matrix-visible');
            setTimeout(function () {
                if (overlay.parentNode) { overlay.parentNode.removeChild(overlay); }
            }, 450);
        }
    }
}

document.addEventListener('DOMContentLoaded', initMatrixEasterEgg);

// =========================================================================
// i18n — language switching
// =========================================================================

var i18n = {
    fr: {
        nav: ['Accueil', 'Profil', 'Parcours', 'Comp\u00e9tences', 'Projets', 'Veille', 'Contact'],
        heroSubtitle: '\u00c9tudiant BTS SIO \u00b7 Option SISR \u00b7 Infrastructure & Cybers\u00e9curit\u00e9',
        heroDesc:     'Passionn\u00e9 par l\u2019infrastructure IT, les r\u00e9seaux et la cybers\u00e9curit\u00e9.\n            En alternance et futur aspirant de l\u2019Arm\u00e9e de l\u2019air fran\u00e7aise.',
        statLabels:   ['Projets r\u00e9alis\u00e9s', 'Technologies', 'Ans d\u2019\u00e9tudes', 'Motivation'],
        footerCopy:   '\u00a9 2025\u20132026 Leseigneur L\u00e9o \u2014 Tous droits r\u00e9serv\u00e9s',
        backToTop:    'Retour en haut de page'
    },
    en: {
        nav: ['Home', 'Profile', 'Background', 'Skills', 'Projects', 'Research', 'Contact'],
        heroSubtitle: 'BTS SIO Student \u00b7 SISR Track \u00b7 Infrastructure & Cybersecurity',
        heroDesc:     'Passionate about IT infrastructure, networking and cybersecurity.\n            Work-study student and aspiring French Air Force officer.',
        statLabels:   ['Projects completed', 'Technologies', 'Years of study', 'Motivation'],
        footerCopy:   '\u00a9 2025\u20132026 Leseigneur L\u00e9o \u2014 All rights reserved',
        backToTop:    'Back to top'
    }
};

function applyLang(lang) {
    var t = i18n[lang];
    if (!t) { return; }

    document.querySelectorAll('.nav-links .nav-link').forEach(function (a, i) {
        if (t.nav[i] !== undefined) { a.textContent = t.nav[i]; }
    });

    var sub = document.querySelector('.hero-subtitle');
    if (sub) { sub.textContent = t.heroSubtitle; }

    var desc = document.querySelector('.hero-description');
    if (desc) { desc.textContent = t.heroDesc; }

    document.querySelectorAll('.stat-label').forEach(function (el, i) {
        if (t.statLabels[i] !== undefined) { el.textContent = t.statLabels[i]; }
    });

    var copy = document.querySelector('.footer-copy');
    if (copy) { copy.textContent = t.footerCopy; }

    var btt = document.getElementById('back-to-top');
    if (btt) { btt.setAttribute('aria-label', t.backToTop); }
}

// =========================================================================
// FEATURE: INTERACTIVE TERMINAL
// =========================================================================

/**
 * Inject a >_ button in the nav that opens a modal terminal.
 * Supports: help, whoami, skills, contact, secret, hack, weather, clear, exit.
 * Desktop: sidebar cheatsheet + ↑/↓ history.
 * Mobile: pill-button row + scrolls input into view on focus.
 *
 * @returns {void}
 */
function initTerminal() {
    // ── Command registry ─────────────────────────────────────────────────
    var COMMANDS = {
        help:      'Liste toutes les commandes disponibles',
        whoami:    'Affiche le profil de L\u00e9o',
        skills:    'Graphique ASCII des comp\u00e9tences',
        contact:   'Email et liens de contact',
        fortune:   'Citation al\u00e9atoire (mythologie, tech, anime)',
        blague:    'Blague s\u00e8che du jour',
        ping:      'Mesure la latence vers lesnorrys.fr',
        countdown: 'Compte \u00e0 rebours avant la fin du BTS',
        history:   'Historique des commandes de la session',
        refresh:   'Recharge la page',
        theme:     'Bascule clair / sombre',
        secret:    'D\u00e9clenche le Matrix rain',
        hack:      'Simulation de hacking (pour rire)',
        weather:   'M\u00e9t\u00e9o en direct (g\u00e9olocalisation)',
        Timezone:  'Changer le fuseau horaire de l\'horloge',
        cv:        'T\u00e9l\u00e9charge le CV',
        matrix:    'Mini pluie de caract\u00e8res dans le terminal',
        lang:      'Changer la langue (fr|en)',
        clear:     'Vide le terminal',
        exit:      'Ferme le terminal'
    };

    var TIMEZONE_MAP = {
        'europe':   'Europe/Paris',
        'london':   'Europe/London',
        'new-york': 'America/New_York',
        'tokyo':    'Asia/Tokyo',
        'sydney':   'Australia/Sydney',
        'utc':      'UTC'
    };

    // ── Build DOM ─────────────────────────────────────────────────────────
    var navContainer = document.querySelector('.nav-container');
    if (!navContainer) { return; }

    var navBtn = document.createElement('button');
    navBtn.className = 'terminal-nav-btn';
    navBtn.setAttribute('aria-label', 'Ouvrir le terminal interactif');
    navBtn.setAttribute('type', 'button');
    navBtn.textContent = '>_';
    navContainer.appendChild(navBtn);

    // Modal
    var modal = document.createElement('div');
    modal.id = 'terminal-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Terminal interactif');

    var win = document.createElement('div');
    win.className = 'term-window';

    // Title bar
    var titlebar = document.createElement('div');
    titlebar.className = 'term-titlebar';
    ['term-dot-red','term-dot-yellow','term-dot-green'].forEach(function (c) {
        var d = document.createElement('span');
        d.className = 'term-dot ' + c;
        titlebar.appendChild(d);
    });
    var titleSpan = document.createElement('span');
    titleSpan.className = 'term-title';
    titleSpan.textContent = 'terminal — leo@portfolio';
    titlebar.appendChild(titleSpan);
    var closeBtn = document.createElement('button');
    closeBtn.className = 'term-close-btn';
    closeBtn.setAttribute('aria-label', 'Fermer le terminal');
    closeBtn.setAttribute('type', 'button');
    closeBtn.textContent = '\u2715'; // ×
    titlebar.appendChild(closeBtn);
    win.appendChild(titlebar);

    // Body
    var body = document.createElement('div');
    body.className = 'term-body';

    // Cheatsheet (desktop sidebar)
    var cheat = document.createElement('div');
    cheat.className = 'term-cheatsheet';
    var cheatTitle = document.createElement('div');
    cheatTitle.className = 'term-cheatsheet-title';
    cheatTitle.textContent = 'Commandes';
    cheat.appendChild(cheatTitle);
    Object.keys(COMMANDS).forEach(function (cmd) {
        var row = document.createElement('div');
        row.className = 'term-cmd-hint';
        row.innerHTML = '<strong>' + cmd + '</strong><span>' + COMMANDS[cmd] + '</span>';
        cheat.appendChild(row);
    });

    // Main
    var main = document.createElement('div');
    main.className = 'term-main';

    var output = document.createElement('div');
    output.className = 'term-output';
    output.setAttribute('aria-live', 'polite');
    main.appendChild(output);

    // Mobile pill row
    var pillRow = document.createElement('div');
    pillRow.className = 'term-pills';
    Object.keys(COMMANDS).forEach(function (cmd) {
        var pill = document.createElement('button');
        pill.className = 'term-pill';
        pill.setAttribute('type', 'button');
        pill.textContent = cmd;
        pill.addEventListener('click', function () {
            input.value = cmd;
            input.focus();
        });
        pillRow.appendChild(pill);
    });
    main.appendChild(pillRow);

    // Input row
    var inputRow = document.createElement('div');
    inputRow.className = 'term-input-row';
    var promptLabel = document.createElement('span');
    promptLabel.className = 'term-prompt-label';
    promptLabel.textContent = 'leo@portfolio:~$';
    var input = document.createElement('input');
    input.className = 'term-input';
    input.setAttribute('type', 'text');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('aria-label', 'Commande terminal');
    inputRow.appendChild(promptLabel);
    var inputWrapper = document.createElement('div');
    inputWrapper.className = 'term-input-wrapper';
    inputWrapper.appendChild(input);

    // Mobile: send button (absolutely positioned inside inputWrapper)
    var sendBtn = document.createElement('button');
    sendBtn.className = 'term-send-btn';
    sendBtn.setAttribute('type', 'button');
    sendBtn.setAttribute('aria-label', 'Envoyer la commande');
    sendBtn.textContent = 'Envoyer';
    sendBtn.addEventListener('click', function () {
        var val = input.value;
        input.value = '';
        histIdx = -1;
        if (val.trim()) { history.unshift(val); }
        dispatch(val);
        input.focus();
    });

    inputWrapper.appendChild(sendBtn);
    inputRow.appendChild(inputWrapper);

    main.appendChild(inputRow);

    body.appendChild(main);
    body.appendChild(cheat);
    win.appendChild(body);
    modal.appendChild(win);
    document.body.appendChild(modal);

    // ── History ──────────────────────────────────────────────────────────
    var history = [];
    var histIdx = -1;

    // ── Helpers ──────────────────────────────────────────────────────────
    function print(text, cls) {
        var line = document.createElement('div');
        line.className = 'term-line' + (cls ? ' ' + cls : '');
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    function printHTML(html, cls) {
        var line = document.createElement('div');
        line.className = 'term-line' + (cls ? ' ' + cls : '');
        line.innerHTML = html;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    function printBlank() { print(''); }

    /**
     * Build a padded ASCII box around an array of text lines.
     * Each line is right-padded to the longest line width.
     * Returns an array of strings (each is one rendered row).
     *
     * @param  {string[]} lines - Content lines (no leading/trailing spaces needed)
     * @returns {string[]}
     */
    function buildAsciiBox(lines) {
        var maxLen = lines.reduce(function (m, l) { return Math.max(m, l.length); }, 0);
        var bar    = '\u2500'.repeat(maxLen + 2);
        var rows   = lines.map(function (l) {
            return '\u2502 ' + l + ' '.repeat(maxLen - l.length) + ' \u2502';
        });
        return ['\u250c' + bar + '\u2510'].concat(rows).concat(['\u2514' + bar + '\u2518']);
    }

    function openTerm() {
        modal.classList.add('term-open');
        var scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = '-' + scrollY + 'px';
        document.body.style.width = '100%';
        document.body.dataset.scrollY = scrollY;
        if (window.innerWidth > 768) { input.focus(); }
        if (output.childNodes.length === 0) { printWelcome(); }
    }

    function closeTerm() {
        modal.classList.remove('term-open');
        var savedScrollY = parseInt(document.body.dataset.scrollY || '0', 10);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        delete document.body.dataset.scrollY;
        window.scrollTo(0, savedScrollY);
        navBtn.focus();
    }

    function printWelcome() {
        print('  _____                   _             _ ', 'term-line-accent');
        print(' |_   _|__ _ __ _ __ ___ (_)_ __   __ _| |', 'term-line-accent');
        print('   | |/ _ \\ \'__| \'_ ` _ \\| | \'_ \\ / _` | |', 'term-line-accent');
        print('   | |  __/ |  | | | | | | | | | | (_| | |', 'term-line-accent');
        print('   |_|\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_|', 'term-line-accent');
        var spacer = document.createElement('div');
        spacer.style.height = '0.75rem';
        output.appendChild(spacer);
        print('  Bienvenue ! Tapez "help" pour voir les commandes.', 'term-line-muted');
        printBlank();
        printBlank();
    }

    // ── Command handlers ─────────────────────────────────────────────────
    function cmdHelp() {
        printBlank();
        print('Commandes disponibles :', 'term-line-accent');
        Object.keys(COMMANDS).forEach(function (cmd) {
            printHTML(
                '<span class="terminal-cmd-name">' + cmd + '</span>' +
                '<span>' + COMMANDS[cmd] + '</span>',
                'help-row'
            );
        });
        printBlank();
    }

    function cmdWhoami() {
        printBlank();
        buildAsciiBox([
            'Leseigneur L\u00e9o',
            '\u00c9tudiant BTS SIO option SISR',
            'Ensitech, Cergy'
        ]).forEach(function (line) { print('  ' + line); });
        printBlank();
        print('  Passions  : Infrastructure, r\u00e9seaux, cybers\u00e9curit\u00e9');
        print('  Fun fact  : Passionn\u00e9 par l\'informatique de mani\u00e8re g\u00e9n\u00e9rale');
        print('  Stack     : Linux, Apache, pfSense, Python, C#');
        printBlank();
    }

    function cmdSkills() {
        var skills = [
            { name: 'Linux / Bash',   pct: 80 },
            { name: 'R\u00e9seaux / VLAN', pct: 75 },
            { name: 'S\u00e9curit\u00e9 / CTF',  pct: 70 },
            { name: 'Python',          pct: 65 },
            { name: 'C# / .NET',       pct: 60 },
            { name: 'HTML/CSS',        pct: 72 }
        ];
        var lines = skills.map(function (s) {
            var bars   = Math.round(s.pct / 5);
            var filled = '\u2588'.repeat(bars);
            var empty  = '\u2591'.repeat(20 - bars);
            return s.name.padEnd(16) + ' [' + filled + empty + '] ' + s.pct + '%';
        });
        printBlank();
        print('  Comp\u00e9tences :', 'term-line-accent');
        buildAsciiBox(lines).forEach(function (line) { print('  ' + line); });
        printBlank();
    }

    function cmdContact() {
        printBlank();
        print('  \u2709  Email  : leo.leseigneur@orange.fr', 'term-line-accent');
        printHTML(
            '  \uD83D\uDD17 GitHub : <span class="term-line-link" onclick="window.open(\'https://github.com/Fufugroudon\',\'_blank\')">github.com/Fufugroudon</span>'
        );
        printHTML(
            '  \uD83C\uDF10 Site   : <span class="term-line-link" onclick="window.open(\'https://lesnorrys.com\',\'_blank\')">lesnorrys.com</span>'
        );
        printBlank();
    }

    function cmdSecret() {
        printBlank();
        buildAsciiBox(['     S\u00c9QUENCE SECR\u00c8TE     ']).forEach(function (l) { print('  ' + l); });
        printBlank();
        printHTML('  <span style="color:#60a5fa">\u25ba \u00c9tape 1 \u2014 Konami Code (desktop)</span>');
        print('    Appuyez sur\u00a0: \u2191 \u2191 \u2193 \u2193 \u2190 \u2192 \u2190 \u2192 B A');
        printBlank();
        printHTML('  <span style="color:#60a5fa">\u25ba \u00c9tape 2 \u2014 Triple Tap (mobile)</span>');
        print('    Appuyez 3 fois sur le logo du site');
        printBlank();
        printHTML('  <span style="color:#60a5fa">\u25ba R\u00e9sultat</span>');
        print('    La pluie Matrix envahit l\u2019\u00e9cran pendant 4 secondes.');
        print('    Message\u00a0: \u201cACC\u00c8S AUTORIS\u00c9\u201d');
        printBlank();
        print('  [ Tapez "easteregg" pour plus de d\u00e9tails ]', 'term-line-muted');
        printBlank();
    }

    function cmdHack() {
        print('  Initialisation de la connexion...', 'term-line-muted');
        var ips   = ['192.168.1.1','10.0.0.1','172.16.4.2','203.0.113.42','198.51.100.7'];
        var msgs  = [
            'PORT SCAN en cours...',
            'Tentative d\'intrusion sur /etc/passwd...',
            'Escalade de privil\u00e8ges...',
            'Ex\u00e9cution du payload...',
            'T\u00e9l\u00e9chargement des donn\u00e9es sensibles...',
            'D\u00e9tect\u00e9 par le syst\u00e8me de d\u00e9fense !'
        ];
        var step  = 0;
        var timer = setInterval(function () {
            if (step < 5) {
                print('  > ' + ips[step] + ' ... ' + msgs[step]);
            } else if (step === 5) {
                print('  > ' + msgs[5], 'term-line-error');
            } else {
                clearInterval(timer);
                printBlank();
                print('  \u26D4 ACC\u00c8S REFUS\u00c9. Cible trop forte.', 'term-line-error');
                printBlank();
            }
            step++;
        }, 380);
    }

    function cmdWeather() {
        var WMO = {
            0:'Ciel d\u00e9gag\u00e9 \u2600\uFE0F', 1:'Principalement d\u00e9gag\u00e9', 2:'Partiellement nuageux \u26C5',
            3:'Couvert \u2601\uFE0F', 45:'Brouillard \uD83C\uDF2B\uFE0F', 48:'Brouillard givrant',
            51:'Bruine l\u00e9g\u00e8re', 61:'Pluie l\u00e9g\u00e8re \uD83C\uDF27\uFE0F', 71:'Neige l\u00e9g\u00e8re \u2744\uFE0F',
            95:'Orage \u26C8\uFE0F', 99:'Orage + gr\u00eale'
        };

        function fetchAndDisplay(lat, lon, cityLabel) {
            var tz  = localStorage.getItem('preferred_timezone') || 'Europe/Paris';
            var url = 'https://api.open-meteo.com/v1/forecast' +
                      '?latitude='  + lat + '&longitude=' + lon +
                      '&current=temperature_2m,wind_speed_10m,weather_code' +
                      '&wind_speed_unit=kmh&timezone=' + encodeURIComponent(tz);

            fetch(url)
                .then(function (r) { return r.json(); })
                .then(function (d) {
                    var c    = d.current;
                    var cond = WMO[c.weather_code] || 'Code ' + c.weather_code;
                    printBlank();
                    buildAsciiBox([
                        'M\u00e9t\u00e9o \u2014 ' + cityLabel,
                        'Temp.  : ' + c.temperature_2m + '\u00b0C',
                        'Vent   : ' + c.wind_speed_10m + ' km/h',
                        cond
                    ]).forEach(function (line) { print('  ' + line); });
                    printBlank();
                })
                .catch(function () {
                    print('  \u26A0\uFE0F Impossible de r\u00e9cup\u00e9rer la m\u00e9t\u00e9o.', 'term-line-error');
                });
        }

        function fallback() {
            fetchAndDisplay(49.2333, 2.1333, 'M\u00e9ru, FR (position par d\u00e9faut)');
        }

        if (!navigator.geolocation) {
            print('  G\u00e9olocalisation non disponible. Utilisation de M\u00e9ru...', 'term-line-muted');
            fallback();
            return;
        }

        print('  R\u00e9cup\u00e9ration de la position...', 'term-line-muted');

        navigator.geolocation.getCurrentPosition(
            function (pos) {
                var lat = pos.coords.latitude;
                var lon = pos.coords.longitude;

                // Reverse-geocode with Nominatim (no API key required)
                fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat +
                      '&lon=' + lon + '&format=json')
                    .then(function (r) { return r.json(); })
                    .then(function (geo) {
                        var addr     = geo.address || {};
                        var city     = addr.city || addr.town || addr.village || addr.county || 'Position';
                        var country  = addr.country_code ? addr.country_code.toUpperCase() : '';
                        var label    = city + (country ? ', ' + country : '');
                        fetchAndDisplay(lat, lon, label);
                    })
                    .catch(function () {
                        fetchAndDisplay(lat, lon, lat.toFixed(2) + ', ' + lon.toFixed(2));
                    });
            },
            function () {
                print('  Acc\u00e8s refus\u00e9. Utilisation de M\u00e9ru...', 'term-line-muted');
                fallback();
            },
            { timeout: 8000 }
        );
    }

    function cmdTimezone(arg) {
        if (!arg) {
            var current = localStorage.getItem('preferred_timezone') || 'Europe/Paris (d\u00e9faut)';
            printBlank();
            print('  Usage: timezone <zone>', 'term-line-accent');
            printBlank();
            print('  Zone active : ' + current);
            printBlank();
            print('  Zones disponibles :');
            Object.keys(TIMEZONE_MAP).forEach(function (k) {
                var displayKey = k === 'utc' ? 'UTC' : k.split('-').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join('-');
                print('    ' + displayKey.padEnd(12) + '\u2192 ' + TIMEZONE_MAP[k]);
            });
            printBlank();
            return;
        }

        var iana = TIMEZONE_MAP[arg];
        if (!iana) {
            print('  Zone inconnue\u00a0: "' + arg + '". Tapez "timezone" pour la liste.', 'term-line-error');
            return;
        }

        localStorage.setItem('preferred_timezone', iana);
        print('  \u2713 Fuseau horaire d\u00e9fini sur ' + iana, 'term-line-accent');
    }

    // ── fortune ──────────────────────────────────────────────────────────
    var FORTUNES = [
        { text: 'Cattle die, kindred die \u2014 every man is mortal. But the glory of the great dead never dies.', src: '\u2014 H\u00e1vam\u00e1l' },
        { text: 'A man who never shuts up knows very little.', src: '\u2014 H\u00e1vam\u00e1l' },
        { text: 'Je sais que je suis pendu \u00e0 l\u2019arbre balay\u00e9 par le vent, bless\u00e9 par une lance, offert \u00e0 moi-m\u00eame \u2014 pour arracher les runes \u00e0 l\u2019ab\u00eeme.', src: '\u2014 H\u00e1vam\u00e1l (Odin d\u00e9couvre les runes)' },
        { text: 'Soixante-douze m\u00e9tamorphoses \u2014 et l\u2019esprit-singe ne peut toujours pas s\u2019\u00e9chapper de sa propre nature.', src: '\u2014 Wu Cheng\u2019en, Le Voyage en Occident' },
        { text: 'Je suis n\u00e9 de la pierre, nourri par le vent. Je ne dois ma vie \u00e0 personne \u2014 et pourtant me voil\u00e0 serviteur.', src: '\u2014 Le Voyage en Occident' },
        { text: 'Even if we painstakingly piece together something lost, it doesn\u2019t mean things will go back to how they were.', src: '\u2014 Kentaro Miura, Berserk' },
        { text: 'In this world, is the destiny of mankind controlled by some transcendental entity or law? At least it is true that man has no control, even over his own will.', src: '\u2014 Berserk, Kentaro Miura' },
        { text: 'If you want to get to know someone, find out what makes them angry.', src: '\u2014 Ging Freecss, Hunter \u00d7 Hunter' },
        { text: 'You should enjoy the little detours to the fullest. Because that\u2019s where you\u2019ll find the things more important than what you want.', src: '\u2014 Ging Freecss, Hunter \u00d7 Hunter' },
        { text: 'A lesson without pain is meaningless. That\u2019s because no one can gain without sacrificing something.', src: '\u2014 Edward Elric, Fullmetal Alchemist' },
        { text: 'Humankind cannot gain anything without first giving something in return. To obtain, something of equal value must be lost.', src: '\u2014 Fullmetal Alchemist, Law of Equivalent Exchange' },
        { text: 'The strength to continue forward comes not from the light ahead, but from the darkness you\u2019ve already crossed.', src: '\u2014 Guts, Berserk (paraphrase)' },
        { text: 'Security is not a product, but a process.', src: '\u2014 Bruce Schneier' },
        { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', src: '\u2014 Harold Abelson, SICP' },
        { text: 'The quieter you become, the more you are able to hear.', src: '\u2014 Kali Linux' },
        { text: 'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.', src: '\u2014 Antoine de Saint-Exup\u00e9ry' },
        { text: 'Any sufficiently advanced technology is indistinguishable from magic.', src: '\u2014 Arthur C. Clarke' },
        { text: 'L\u2019ennui est le seuil du danger \u2014 c\u2019est l\u00e0 que naissent les vraies id\u00e9es.', src: '\u2014 Hisoka Morow, Hunter \u00d7 Hunter (paraphrase)' },
        { text: 'What cannot be cured must be endured \u2014 and what is endured shapes what you become.', src: '\u2014 Casca, Berserk (paraphrase)' },
        { text: 'The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.', src: '\u2014 Marcel Proust' }
    ];

    function cmdFortune() {
        var q = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        printBlank();
        print('  \u201c' + q.text + '\u201d');
        print('  ' + q.src, 'term-line-accent');
        printBlank();
    }

    // ── blague ───────────────────────────────────────────────────────────
    var BLAGUES = [
        'Il y a 10 types de personnes\u00a0: ceux qui comprennent le binaire, et les autres.',
        'Un SQL se prom\u00e8ne dans un bar, voit deux tables et demande\u00a0: \u00ab\u00a0Je peux JOIN\u00a0?\u00a0\u00bb',
        'R\u00e9cursion\u00a0: voir \u00ab\u00a0R\u00e9cursion\u00a0\u00bb.',
        'Mon code fonctionne. Je ne sais pas pourquoi. Je n\u2019y touche plus.',
        '404\u00a0: blague introuvable.',
        'Je ne dors pas \u2014 j\u2019attends que le build se termine.',
        'L\u2019optimisme en informatique, c\u2019est croire que le bug est dans le code des autres.',
        'rm -rf /. Rien \u00e0 voir. Circulez.',
        'Un dev senior, c\u2019est un dev junior qui a appris \u00e0 dire \u00ab\u00a0\u00e7a d\u00e9pend\u00a0\u00bb.',
        '\u00ab\u00a0\u00c7a marche en local\u00a0\u00bb \u2014 \u00e9pitaphe d\u2019un serveur de production.'
    ];

    function cmdBlague() {
        var joke = BLAGUES[Math.floor(Math.random() * BLAGUES.length)];
        printBlank();
        print('  ' + joke, 'term-line-accent');
        printBlank();
    }

    // ── ping ─────────────────────────────────────────────────────────────
    function cmdPing() {
        print('  PING lesnorrys.fr\u2026', 'term-line-accent');
        var t0 = performance.now();
        var controller = new AbortController();
        var timer = setTimeout(function () { controller.abort(); }, 5000);
        fetch('https://lesnorrys.fr', { mode: 'no-cors', signal: controller.signal })
            .then(function () {
                clearTimeout(timer);
                var ms = Math.round(performance.now() - t0);
                print('  PING lesnorrys.fr \u2014 r\u00e9ponse en ' + ms + 'ms [OK]', 'term-line-accent');
            })
            .catch(function () {
                clearTimeout(timer);
                print('  PING lesnorrys.fr \u2014 [TIMEOUT]', 'term-line-error');
            });
    }

    // ── countdown ────────────────────────────────────────────────────────
    function cmdCountdown() {
        var end  = new Date('2027-05-31T00:00:00');
        var diff = end - Date.now();
        printBlank();
        if (diff <= 0) {
            print('  BTS termin\u00e9\u00a0! \ud83c\udf93', 'term-line-accent');
            printBlank();
            return;
        }
        var days    = Math.floor(diff / 86400000);
        var hours   = Math.floor((diff % 86400000) / 3600000);
        var minutes = Math.floor((diff % 3600000) / 60000);
        var seconds = Math.floor((diff % 60000) / 1000);
        buildAsciiBox([
            'Fin du BTS SIO SISR \u2014 31 mai 2027',
            '',
            days + ' jours, ' + hours + ' heures, ' + minutes + ' minutes, ' + seconds + ' secondes'
        ]).forEach(function (l) { print('  ' + l); });
        printBlank();
    }

    // ── history ──────────────────────────────────────────────────────────
    function cmdHistory() {
        if (history.length === 0) {
            print('  Aucune commande dans l\u2019historique.', 'term-line-accent');
            return;
        }
        printBlank();
        history.slice().reverse().forEach(function (cmd, i) {
            print('  ' + String(i + 1).padStart(3) + '  ' + cmd);
        });
        printBlank();
    }

    // ── refresh ──────────────────────────────────────────────────────────
    function cmdRefresh() {
        print('  Rechargement\u2026', 'term-line-accent');
        setTimeout(function () { location.reload(); }, 600);
    }

    // ── theme ────────────────────────────────────────────────────────────
    function cmdTheme() {
        var toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.click();
        } else {
            var light = document.body.classList.toggle('light-mode');
            localStorage.setItem('theme', light ? 'light' : 'dark');
        }
        var isLight = document.body.classList.contains('light-mode');
        print('  Th\u00e8me\u00a0: ' + (isLight ? 'clair \u2600\ufe0f' : 'sombre \ud83c\udf19'), 'term-line-accent');
    }

    // ── lang ─────────────────────────────────────────────────────────────
    function cmdLang(arg) {
        var current = localStorage.getItem('preferred_lang') || 'fr';
        if (!arg) {
            printBlank();
            print('  Usage\u00a0: lang <fr|en>', 'term-line-accent');
            print('  Langue actuelle\u00a0: ' + current);
            printBlank();
            return;
        }
        if (arg !== 'fr' && arg !== 'en') {
            print('  Langue inconnue. Utilisez "lang fr" ou "lang en".', 'term-line-error');
            return;
        }
        localStorage.setItem('preferred_lang', arg);
        applyLang(arg);
        print('  \u2713 Langue d\u00e9finie sur\u00a0: ' + arg, 'term-line-accent');
    }

    // ── matrix (mini terminal rain) ──────────────────────────────────────
    function cmdMatrix() {
        var CHARS    = ['\u30A2','\u30A4','\u30A6','\u30A8','\u30AA','\u30AB','\u30AD','\u30AF','0','1'];
        var rowCount = 12;
        var row      = 0;
        printBlank();
        function nextRow() {
            if (row >= rowCount) {
                setTimeout(function () { print('  Simulation termin\u00e9e.', 'term-line-accent'); }, 80);
                return;
            }
            var line = '  ';
            for (var i = 0; i < 28; i++) {
                line += CHARS[Math.floor(Math.random() * CHARS.length)] + ' ';
            }
            printHTML('<span style="color:#22c55e;font-family:monospace">' + line + '</span>');
            row++;
            setTimeout(nextRow, 80);
        }
        nextRow();
    }

    // ── cv ───────────────────────────────────────────────────────────────
    function cmdCv() {
        print('  \uD83D\uDCC4 T\u00e9l\u00e9chargement du CV en cours\u2026', 'term-line-accent');
        var a = document.createElement('a');
        a.href = '/docs/L\u00e9o_CV.pdf';
        a.download = 'L\u00e9o_CV.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // ── Command dispatcher ───────────────────────────────────────────────
    function dispatch(raw) {
        var parts  = raw.trim().split(/\s+/);
        var cmd    = parts[0].toLowerCase();
        var cmdArg = parts.slice(1).join(' ').toLowerCase();
        print('leo@portfolio:~$ ' + raw, 'term-line-prompt');

        switch (cmd) {
            case 'help':      cmdHelp();            break;
            case 'whoami':    cmdWhoami();           break;
            case 'skills':    cmdSkills();           break;
            case 'contact':   cmdContact();          break;
            case 'fortune':   cmdFortune();          break;
            case 'blague':    cmdBlague();           break;
            case 'ping':      cmdPing();             break;
            case 'countdown': cmdCountdown();        break;
            case 'history':   cmdHistory();          break;
            case 'refresh':   cmdRefresh();          break;
            case 'theme':     cmdTheme();            break;
            case 'secret':    cmdSecret();           break;
            case 'hack':      cmdHack();             break;
            case 'weather':   cmdWeather();          break;
            case 'timezone':  cmdTimezone(cmdArg);   break;
            case 'cv':        cmdCv();               break;
            case 'matrix':    cmdMatrix();           break;
            case 'lang':      cmdLang(cmdArg);       break;
            case 'clear':
                while (output.firstChild) { output.removeChild(output.firstChild); }
                printWelcome();
                break;
            case 'exit':
                closeTerm();
                break;
            default:
                if (cmd !== '') {
                    print('  Commande introuvable: "' + cmd + '". Tapez "help".', 'term-line-error');
                }
        }
    }

    // ── Input handling ───────────────────────────────────────────────────
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            var val = input.value;
            input.value = '';
            histIdx = -1;
            if (val.trim()) { history.unshift(val); }
            dispatch(val);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx]; }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (histIdx > 0) { histIdx--; input.value = history[histIdx]; }
            else { histIdx = -1; input.value = ''; }
        } else if (e.key === 'Escape') {
            closeTerm();
        }
    });

    // Mobile: scroll input into view on focus
    input.addEventListener('focus', function () {
        setTimeout(function () { input.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 300);
    });

    // ── Open / close ─────────────────────────────────────────────────────
    navBtn.addEventListener('click', openTerm);
    closeBtn.addEventListener('click', closeTerm);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) { closeTerm(); }
    });
}

document.addEventListener('DOMContentLoaded', initTerminal);

// Apply stored language preference on load
document.addEventListener('DOMContentLoaded', function () {
    var lang = localStorage.getItem('preferred_lang');
    if (lang && i18n[lang]) { applyLang(lang); }
});

// =============================================================================
// TRIPLE-CLICK MYTHOLOGICAL CREATURE EASTER EGG
// =============================================================================
(function () {
    'use strict';

    var CREATURES = [
        '\uD83D\uDC09', // 🐉
        '\uD83E\uDD85', // 🦅
        '\uD83C\uDF0A', // 🌊
        '\u26A1',       // ⚡
        '\uD83D\uDC3A', // 🐺
        '\uD83E\uDD81', // 🦁
        '\uD83D\uDC0D', // 🐍
        '\uD83E\uDD84', // 🦄
        '\uD83C\uDF19', // 🌙
        '\uD83D\uDD31', // 🔱
        '\uD83D\uDC12', // 🐒
        '\uD83D\uDC80', // 💀
        '\uD83E\uDD8A', // 🦊
        '\uD83C\uDF38'  // 🌸
    ];

    var LABELS = {
        '\uD83D\uDC09': 'Dragon',
        '\uD83E\uDD85': 'Ph\u00e9nix',
        '\uD83C\uDF0A': 'L\u00e9viathan',
        '\u26A1':       'Thor',
        '\uD83D\uDC3A': 'Fenrir',
        '\uD83E\uDD81': 'Lion de N\u00e9m\u00e9e',
        '\uD83D\uDC0D': 'Serpent',
        '\uD83E\uDD84': 'Licorne',
        '\uD83C\uDF19': 'S\u00e9l\u00e9n\u00e9',
        '\uD83D\uDD31': 'Pos\u00e9idon',
        '\uD83D\uDC12': 'Sun Wukong',
        '\uD83D\uDC80': 'Hel',
        '\uD83E\uDD8A': 'Kitsune',
        '\uD83C\uDF38': 'Amaterasu'
    };

    var PARTICLE_COLORS = ['#3b82f6', '#60a5fa', '#f97316', '#ffffff', '#93c5fd'];

    function spawnExplosion(x, y) {
        var count = Math.floor(Math.random() * 5) + 12; // 12–16
        for (var i = 0; i < count; i++) {
            (function () {
                var p = document.createElement('div');
                var size = Math.floor(Math.random() * 6) + 5; // 5–10px
                var angle = Math.random() * 2 * Math.PI;
                var dist  = Math.floor(Math.random() * 60) + 40; // 40–100px
                var color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
                var dx = Math.cos(angle) * dist;
                var dy = Math.sin(angle) * dist;

                p.style.cssText = [
                    'position:fixed',
                    'left:' + (x - size / 2) + 'px',
                    'top:'  + (y - size / 2) + 'px',
                    'width:'  + size + 'px',
                    'height:' + size + 'px',
                    'border-radius:50%',
                    'background:' + color,
                    'pointer-events:none',
                    'z-index:9997',
                    'transition:transform 0.6s ease-out,opacity 0.6s ease-out'
                ].join(';');

                document.body.appendChild(p);

                // Trigger transition on next frame
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        p.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0)';
                        p.style.opacity   = '0';
                    });
                });

                setTimeout(function () { p.parentNode && p.parentNode.removeChild(p); }, 650);
            }());
        }
    }

    function spawnCreature(x, y) {
        var emoji   = CREATURES[Math.floor(Math.random() * CREATURES.length)];
        var label   = LABELS[emoji] || '';

        var wrap = document.createElement('div');
        wrap.style.cssText = [
            'position:fixed',
            'left:' + x + 'px',
            'top:'  + y + 'px',
            'transform:translate(-50%,-50%) translateY(0) scale(0.5)',
            'font-size:3rem',
            'line-height:1',
            'text-align:center',
            'pointer-events:none',
            'z-index:9998',
            'opacity:1',
            'transition:transform 1.2s cubic-bezier(0.22,1,0.36,1),opacity 1.2s ease'
        ].join(';');

        var emojiEl = document.createElement('div');
        emojiEl.textContent = emoji;

        var labelEl = document.createElement('div');
        labelEl.textContent = label;
        labelEl.style.cssText = [
            'font-size:0.75rem',
            'color:#ffffff',
            'font-family:\'Courier New\',monospace',
            'margin-top:0.25rem',
            'white-space:nowrap'
        ].join(';');

        wrap.appendChild(emojiEl);
        wrap.appendChild(labelEl);
        document.body.appendChild(wrap);

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                wrap.style.transform = 'translate(-50%,-50%) translateY(-150px) scale(1.5)';
                wrap.style.opacity   = '0';
            });
        });

        setTimeout(function () { wrap.parentNode && wrap.parentNode.removeChild(wrap); }, 2000);
    }

    function initCreatureEasterEgg() {
        var section = document.getElementById('accueil');
        if (!section) { return; }

        var clicks    = [];
        var THRESHOLD = 900; // ms

        function handleInteraction(clientX, clientY) {
            var now = Date.now();
            clicks.push(now);
            // keep only clicks within the last THRESHOLD ms
            clicks = clicks.filter(function (t) { return now - t <= THRESHOLD; });

            if (clicks.length >= 3) {
                clicks = [];
                spawnExplosion(clientX, clientY);
                spawnCreature(clientX, clientY);
            }
        }

        section.addEventListener('click', function (e) {
            handleInteraction(e.clientX, e.clientY);
        });

        section.addEventListener('touchstart', function (e) {
            if (e.touches && e.touches.length > 0) {
                handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
    }

    document.addEventListener('DOMContentLoaded', initCreatureEasterEgg);
}());

// =============================================================================
// CREATURE LEGEND POPUP — footer bottom-right
// =============================================================================
(function () {
    'use strict';

    var BESTIARY = {
        '\uD83D\uDC09': { name: 'Dragon',          desc: 'Cr\u00e9ature l\u00e9gendaire crachant du feu, symbole de puissance en Orient comme en Occident.' },
        '\uD83E\uDD85': { name: 'Ph\u00e9nix',     desc: 'Oiseau immortel renaissant de ses cendres, symbole de r\u00e9surrection dans la mythologie grecque.' },
        '\uD83C\uDF0A': { name: 'L\u00e9viathan',  desc: 'Monstre marin colossal des profondeurs, issu de la tradition h\u00e9bra\u00efque et biblique.' },
        '\u26A1':       { name: 'Thor',             desc: 'Dieu nordique du tonnerre, fils d\u2019Odin, ma\u00eetre de Mjolnir, protecteur des hommes.' },
        '\uD83D\uDC3A': { name: 'Fenrir',           desc: 'Loup g\u00e9ant de la mythologie nordique, fils de Loki, destin\u00e9 \u00e0 d\u00e9vorer Odin lors du Ragnar\u00f6k.' },
        '\uD83E\uDD81': { name: 'Lion de N\u00e9m\u00e9e', desc: 'Lion invuln\u00e9rable tu\u00e9 par H\u00e9racl\u00e8s lors de son premier travail, peau devenue son armure.' },
        '\uD83D\uDC0D': { name: 'Serpent',          desc: 'Figure ambivalente dans toutes les mythologies\u00a0: sagesse, chaos ou renaissance selon les cultures.' },
        '\uD83E\uDD84': { name: 'Licorne',          desc: 'Cheval ail\u00e9 \u00e0 corne unique, symbole de puret\u00e9 et de magie dans les l\u00e9gendes europ\u00e9ennes.' },
        '\uD83C\uDF19': { name: 'S\u00e9l\u00e9n\u00e9', desc: 'D\u00e9esse grecque de la Lune, s\u0153ur d\u2019H\u00e9lios, conduisant son char lunaire \u00e0 travers le ciel nocturne.' },
        '\uD83D\uDD31': { name: 'Pos\u00e9idon',   desc: 'Dieu grec des mers et des tremblements de terre, fr\u00e8re de Zeus, ma\u00eetre du trident.' },
        '\uD83D\uDC12': { name: 'Sun Wukong',       desc: 'Roi Singe de la mythologie chinoise, h\u00e9ros de La P\u00e9r\u00e9grination vers l\u2019Ouest, ma\u00eetre des 72 transformations.' },
        '\uD83D\uDC80': { name: 'Hel',              desc: 'D\u00e9esse nordique des morts, fille de Loki, souveraine de Niflheim, royaume des \u00e2mes d\u00e9funtes.' },
        '\uD83E\uDD8A': { name: 'Kitsune',          desc: 'Renard \u00e0 plusieurs queues de la mythologie japonaise, esprit rus\u00e9 et sage pouvant prendre forme humaine.' },
        '\uD83C\uDF38': { name: 'Amaterasu',        desc: 'Grande d\u00e9esse shinto du Soleil, souveraine des cieux, anc\u00eatre mythique de la famille imp\u00e9riale japonaise.' }
    };

    function initCreatureLegend() {
        // ── Trigger button ────────────────────────────────────────────────
        var btn = document.createElement('button');
        btn.id = 'creature-legend-btn';
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-label', 'Ouvrir le bestiaire mythologique');
        btn.setAttribute('title', 'Bestiaire mythologique');

        var badge = document.createElement('span');
        badge.className = 'creature-legend-badge';
        badge.textContent = '?';
        btn.textContent = '\uD83D\uDC09';
        btn.appendChild(badge);

        document.body.appendChild(btn);

        // ── Panel ─────────────────────────────────────────────────────────
        var panel = document.createElement('div');
        panel.id = 'creature-legend-panel';
        panel.setAttribute('aria-hidden', 'true');
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-label', 'Bestiaire mythologique');

        // Header
        var header = document.createElement('div');
        header.className = 'creature-legend-header';

        var title = document.createElement('span');
        title.className = 'creature-legend-title';
        title.textContent = '\uD83D\uDCDA Bestiaire Mythologique';

        var closeBtn = document.createElement('button');
        closeBtn.className = 'creature-legend-close';
        closeBtn.setAttribute('type', 'button');
        closeBtn.setAttribute('aria-label', 'Fermer');
        closeBtn.textContent = '\u2715';

        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        // Rows
        var list = document.createElement('div');
        list.className = 'creature-legend-list';

        var keys = Object.keys(BESTIARY);
        keys.forEach(function (emoji, i) {
            var entry = BESTIARY[emoji];
            var row = document.createElement('div');
            row.className = 'creature-legend-row' + (i === keys.length - 1 ? ' last' : '');

            var emojiEl = document.createElement('span');
            emojiEl.className = 'creature-legend-emoji';
            emojiEl.textContent = emoji;

            var info = document.createElement('div');
            info.className = 'creature-legend-info';

            var nameEl = document.createElement('span');
            nameEl.className = 'creature-legend-name';
            nameEl.textContent = entry.name;

            var descEl = document.createElement('span');
            descEl.className = 'creature-legend-desc';
            descEl.textContent = entry.desc;

            info.appendChild(nameEl);
            info.appendChild(descEl);
            row.appendChild(emojiEl);
            row.appendChild(info);
            list.appendChild(row);
        });

        panel.appendChild(list);
        document.body.appendChild(panel);

        // ── Open / close ──────────────────────────────────────────────────
        var isOpen = false;

        function openPanel() {
            panel.classList.add('creature-legend-open');
            panel.setAttribute('aria-hidden', 'false');
            isOpen = true;
            closeBtn.focus();
        }

        function closePanel() {
            panel.classList.remove('creature-legend-open');
            panel.setAttribute('aria-hidden', 'true');
            isOpen = false;
            btn.focus();
        }

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            isOpen ? closePanel() : openPanel();
        });

        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            closePanel();
        });

        document.addEventListener('click', function (e) {
            if (isOpen && !panel.contains(e.target) && e.target !== btn) {
                closePanel();
            }
        });

        document.addEventListener('touchstart', function (e) {
            if (isOpen && !panel.contains(e.target) && e.target !== btn) {
                closePanel();
            }
        }, { passive: true });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) { closePanel(); }
        });
    }

    document.addEventListener('DOMContentLoaded', initCreatureLegend);
}());

// =============================================================================
// SCROLL-DOWN ARROW — hero section
// =============================================================================
(function () {
    'use strict';

    function initScrollIndicator() {
        var btn    = document.querySelector('.scroll-indicator');
        var target = document.getElementById('profil');
        if (!btn || !target) { return; }

        btn.addEventListener('click', function () {
            var scroller = document.scrollingElement || document.documentElement;
            var startY   = scroller.scrollTop;
            var targetY  = target.getBoundingClientRect().top + startY;
            var distance = targetY - startY;
            var duration = 800;
            var startTime = null;

            function step(now) {
                if (!startTime) { startTime = now; }
                var elapsed  = now - startTime;
                var progress = Math.min(elapsed / duration, 1);
                var ease     = 1 - Math.pow(1 - progress, 4);
                scroller.scrollTop = startY + distance * ease;
                if (progress < 1) { requestAnimationFrame(step); }
            }
            requestAnimationFrame(step);
        });

        var hero = document.getElementById('accueil');
        if (hero) {
            var observer = new IntersectionObserver(function (entries) {
                var visible = entries[0].isIntersecting;
                btn.style.opacity       = visible ? '1' : '0';
                btn.style.pointerEvents = visible ? 'auto' : 'none';
            }, { threshold: 0.1 });
            observer.observe(hero);
        }
    }

    document.addEventListener('DOMContentLoaded', initScrollIndicator);
}());

// =============================================================================
// CREATURE LEGEND — triple-click hint
// =============================================================================
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var panel = document.getElementById('creature-legend-panel');
        if (!panel) { return; }

        var list = panel.querySelector('.creature-legend-list');
        if (!list) { return; }

        var hint = document.createElement('p');
        hint.className   = 'creature-legend-hint';
        hint.textContent = '\uD83D\uDCA1 Triple-clic sur le fond de l\u2019accueil pour invoquer une cr\u00e9ature';

        panel.insertBefore(hint, list);
    });
}());

// =============================================================================
// SECTION PROGRESS DOTS
// =============================================================================
(function () {
    'use strict';

    var SECTIONS = [
        { id: 'accueil',     label: 'Accueil' },
        { id: 'profil',      label: 'Profil' },
        { id: 'parcours',    label: 'Parcours' },
        { id: 'competences', label: 'Compétences' },
        { id: 'projets',     label: 'Projets' },
        { id: 'veille',      label: 'Veille' },
        { id: 'contact',     label: 'Contact' }
    ];

    function initSectionDots() {
        var nav = document.createElement('nav');
        nav.id = 'section-dots';
        nav.setAttribute('aria-label', 'Navigation par sections');

        var dots = [];

        SECTIONS.forEach(function (s, i) {
            var el = document.querySelector('#' + s.id);
            if (!el) { return; }

            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'section-dot';
            dot.setAttribute('aria-label', 'Aller à ' + s.label);
            dot.setAttribute('data-section', s.id);

            var tooltip = document.createElement('span');
            tooltip.className = 'section-dot-label';
            tooltip.textContent = s.label;
            dot.appendChild(tooltip);

            dot.addEventListener('click', function () {
                var scroller  = document.scrollingElement || document.documentElement;
                var startY    = scroller.scrollTop;
                var targetY   = el.getBoundingClientRect().top + startY;
                var distance  = targetY - startY;
                var duration  = 800;
                var startTime = null;

                function step(now) {
                    if (!startTime) { startTime = now; }
                    var elapsed  = now - startTime;
                    var progress = Math.min(elapsed / duration, 1);
                    var ease     = 1 - Math.pow(1 - progress, 4);
                    scroller.scrollTop = startY + distance * ease;
                    if (progress < 1) { requestAnimationFrame(step); }
                }
                requestAnimationFrame(step);
            });

            nav.appendChild(dot);
            dots.push({ dot: dot, el: el });
        });

        document.body.appendChild(nav);

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) { return; }
                dots.forEach(function (d) {
                    var active = d.el === entry.target;
                    d.dot.classList.toggle('active', active);
                    d.dot.setAttribute('aria-current', active ? 'true' : 'false');
                });
            });
        }, { threshold: 0.4 });

        dots.forEach(function (d) { observer.observe(d.el); });
    }

    document.addEventListener('DOMContentLoaded', initSectionDots);
}());

// =============================================================================
// COPY EMAIL BUTTON
// =============================================================================
(function () {
    'use strict';

    function initCopyEmail() {
        var emailLink = document.querySelector('#contact a[href^="mailto:"]');
        if (!emailLink) { return; }

        var email = emailLink.textContent.trim();

        var copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'copy-email-btn';
        copyBtn.setAttribute('aria-label', 'Copier l\u2019adresse email');
        copyBtn.textContent = '\uD83D\uDCCB';

        emailLink.parentNode.insertBefore(copyBtn, emailLink.nextSibling);

        copyBtn.addEventListener('click', function () {
            if (!navigator.clipboard) { return; }
            navigator.clipboard.writeText(email).then(function () {
                copyBtn.textContent = '\u2705';
                showToast('Email copi\u00e9\u00a0!');
                setTimeout(function () { copyBtn.textContent = '\uD83D\uDCCB'; }, 2000);
            });
        });
    }

    function showToast(msg) {
        var toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = msg;
        document.body.appendChild(toast);

        requestAnimationFrame(function () {
            toast.classList.add('copy-toast-show');
        });

        setTimeout(function () {
            toast.classList.remove('copy-toast-show');
            setTimeout(function () { toast.remove(); }, 400);
        }, 1600);
    }

    document.addEventListener('DOMContentLoaded', initCopyEmail);
}());

// =============================================================================
// SKILLS GRID ANIMATED BACKGROUND
// =============================================================================
(function () {
    'use strict';

    function initSkillsGridCanvas() {
        var section = document.getElementById('competences');
        if (!section) { return; }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

        var canvas = document.createElement('canvas');
        canvas.id = 'skills-grid-canvas';
        section.insertBefore(canvas, section.firstChild);

        var ctx     = canvas.getContext('2d');
        var GAP     = 40;
        var DOT_R   = 2;
        var pulses  = [];

        function resize() {
            canvas.width  = section.offsetWidth;
            canvas.height = section.offsetHeight;
        }

        function randomPulse() {
            var cols = Math.floor(canvas.width  / GAP);
            var rows = Math.floor(canvas.height / GAP);
            return {
                cx:      (Math.floor(Math.random() * cols) + 0.5) * GAP,
                cy:      (Math.floor(Math.random() * rows) + 0.5) * GAP,
                r:       DOT_R,
                growing: true
            };
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Static grid dots
            ctx.fillStyle = 'rgba(59,130,246,0.08)';
            for (var x = GAP / 2; x < canvas.width; x += GAP) {
                for (var y = GAP / 2; y < canvas.height; y += GAP) {
                    ctx.beginPath();
                    ctx.arc(x, y, DOT_R, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Pulsing dots
            pulses.forEach(function (p, i) {
                ctx.beginPath();
                ctx.arc(p.cx, p.cy, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(59,130,246,0.3)';
                ctx.fill();

                if (p.growing) {
                    p.r += 0.12;
                    if (p.r >= 6) { p.growing = false; }
                } else {
                    p.r -= 0.12;
                    if (p.r <= DOT_R) { pulses.splice(i, 1); }
                }
            });

            requestAnimationFrame(draw);
        }

        setInterval(function () {
            if (pulses.length < 3) {
                pulses.push(randomPulse());
                pulses.push(randomPulse());
            }
        }, 3000);

        resize();
        window.addEventListener('resize', resize, { passive: true });
        requestAnimationFrame(draw);
    }

    document.addEventListener('DOMContentLoaded', initSkillsGridCanvas);
}());

// =============================================================================
// AVAILABILITY BADGE — hero section
// =============================================================================
(function () {
    'use strict';

    function initAvailabilityBadge() {
        var subtitle = document.querySelector('#accueil .hero-subtitle');
        if (!subtitle) { return; }

        var badge = document.createElement('div');
        badge.id = 'availability-badge';

        var dot = document.createElement('span');
        dot.className = 'pulse-dot';

        badge.appendChild(dot);
        badge.appendChild(document.createTextNode('Disponible en alternance'));

        subtitle.parentNode.insertBefore(badge, subtitle.nextSibling);
    }

    document.addEventListener('DOMContentLoaded', initAvailabilityBadge);
}());
