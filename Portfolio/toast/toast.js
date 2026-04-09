(function () {
    'use strict';

    // =========================================================================
    // TOAST NOTIFICATION SYSTEM
    // =========================================================================
    //
    // Exposes window.showToast(message, type, linkTarget).
    //
    // type     : "error" | "warning" | "success" | "info"
    // linkTarget: optional CSS selector — renders a clickable link that
    //             smooth-scrolls to the target element and clears the hash.
    //
    // All visual styling is in toast.css — zero inline styles here.

    var container = null;

    var ICONS = {
        error:   '\u2715',  // ✕
        warning: '\u26A0',  // ⚠
        success: '\u2713',  // ✓
        info:    '\u2139'   // ℹ
    };

    /**
     * Trigger the slide-out animation then remove the toast from the DOM.
     *
     * @param {HTMLElement} toast
     * @param {number}      timer - Auto-dismiss timeout ID to cancel.
     */
    function dismiss(toast, timer) {
        clearTimeout(timer);
        toast.classList.add('dismissing');
        setTimeout(function () {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    /**
     * Display a toast notification.
     *
     * @param {string}      message    - Text shown inside the toast.
     * @param {string}      [type]     - "error" | "warning" | "success" | "info"
     * @param {string}      [linkTarget] - CSS selector for an optional action link.
     */
    window.showToast = function (message, type, linkTarget) {
        if (!container) { return; }

        type = type || 'info';

        // ── Root element ─────────────────────────────────────────────────────
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');

        // ── Icon ─────────────────────────────────────────────────────────────
        var icon = document.createElement('span');
        icon.className = 'toast-icon';
        icon.textContent = ICONS[type] || ICONS.info;
        icon.setAttribute('aria-hidden', 'true');

        // ── Body ─────────────────────────────────────────────────────────────
        var body = document.createElement('div');
        body.className = 'toast-body';

        var msg = document.createElement('p');
        msg.className = 'toast-message';
        msg.textContent = message;
        body.appendChild(msg);

        if (linkTarget) {
            var link = document.createElement('a');
            link.className = 'toast-link';
            link.textContent = '\u2192 En savoir plus';
            link.href = '#';
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var el = document.querySelector(linkTarget);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    history.pushState({}, '', location.pathname);
                }
                dismiss(toast, timer);
            });
            body.appendChild(link);
        }

        // ── Close button ─────────────────────────────────────────────────────
        var closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.setAttribute('type', 'button');
        closeBtn.setAttribute('aria-label', 'Fermer la notification');
        closeBtn.textContent = '\u00d7'; // ×

        // ── Progress bar ─────────────────────────────────────────────────────
        var progress = document.createElement('div');
        progress.className = 'toast-progress';

        // ── Assemble ─────────────────────────────────────────────────────────
        toast.appendChild(icon);
        toast.appendChild(body);
        toast.appendChild(closeBtn);
        toast.appendChild(progress);
        container.appendChild(toast);

        // ── Enforce maximum 10 visible toasts ────────────────────────────────
        if (container.children.length > 10) {
            var oldest = container.children[0];
            oldest.classList.add('dismissing');
            setTimeout(function () {
                if (oldest.parentNode) { oldest.parentNode.removeChild(oldest); }
            }, 300);
        }

        // ── Auto-dismiss ─────────────────────────────────────────────────────
        var timer = setTimeout(function () {
            dismiss(toast, timer);
        }, 15000);

        closeBtn.addEventListener('click', function () {
            dismiss(toast, timer);
        });
    };

    // ── Inject container on load ─────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.setAttribute('aria-label', 'Notifications');
        document.body.appendChild(container);
    });
}());
