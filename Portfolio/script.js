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
    'Git':        'Logiciel de gestion de versions',
    'Docker':     'Plateforme de conteneurisation'
};

/**
 * Attach a tooltip <span> to every .tag whose text matches TAG_DESCRIPTIONS.
 * Adds data-tooltip attribute and a .has-tooltip class; tooltip visibility
 * is driven entirely by CSS — no JS hover listeners needed.
 *
 * @returns {void}
 */
function initTagTooltips() {
    document.querySelectorAll('.tag').forEach(function (tag) {
        var text = tag.textContent.trim();
        var desc = TAG_DESCRIPTIONS[text];
        if (!desc) { return; }

        tag.setAttribute('data-tooltip', desc);
        tag.classList.add('has-tooltip');

        var tip = document.createElement('span');
        tip.className = 'tag-tooltip';
        tip.textContent = desc;
        tip.setAttribute('role', 'tooltip');
        tag.appendChild(tip);
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
    var MAX_TILT = 12; // degrees
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
                'rgba(255,255,255,0.14) 0%, transparent 55%)';
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
        var now  = new Date();
        var h    = pad(now.getHours());
        var m    = pad(now.getMinutes());
        var s    = pad(now.getSeconds());
        var day  = DAYS[now.getDay()];
        var date = now.getDate();
        var mon  = MONTHS[now.getMonth()];
        var yr   = now.getFullYear();

        timeEl.textContent = h + ':' + m + ':' + s;
        dateEl.textContent = day + ' ' + date + ' ' + mon + ' ' + yr;
    }

    tick();
    setInterval(tick, 1000);
}

document.addEventListener('DOMContentLoaded', initLiveClock);
