(function () {
    'use strict';

    // ── Hash-free anchor navigation ──────────────────────────────────────────
    //
    // Intercepts clicks on any <a href="#..."> link, smooth-scrolls to the
    // target element, then clears the hash from the URL via pushState so the
    // address bar never shows a fragment.

    document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) { return; }

        var hash = link.getAttribute('href');
        if (hash === '#') { return; }

        var target = document.querySelector(hash);
        if (!target) { return; }

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState({}, '', location.pathname);
    });

    // ── reCAPTCHA guard on contact form ──────────────────────────────────────
    //
    // Blocks form submission (and stops subsequent listeners) when the
    // reCAPTCHA widget has not been completed by the user.

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('contact-form');
        if (!form) { return; }

        form.addEventListener('submit', function (e) {
            var response = (typeof grecaptcha !== 'undefined') ? grecaptcha.getResponse() : '';
            if (!response) {
                e.preventDefault();
                e.stopImmediatePropagation();
                alert('Veuillez valider le CAPTCHA.');
            }
        });
    });
}());
