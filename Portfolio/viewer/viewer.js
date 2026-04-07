(function () {
    'use strict';

    var overlay     = null;
    var frame       = null;
    var lastFocused = null;

    var PREVIEWABLE = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

    function getExtension(url) {
        var path  = url.split('?')[0].split('#')[0];
        var parts = path.split('.');
        return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
    }

    function onEscape(e) {
        if (e.key === 'Escape') { closeViewer(); }
    }

    function openViewer(url) {
        var src = url + (getExtension(url) === 'pdf' ? '#toolbar=0' : '');
        frame.src = src;
        if (!overlay.classList.contains('is-open')) {
            lastFocused = document.activeElement;
            overlay.classList.add('is-open');
            document.addEventListener('keydown', onEscape);
            overlay.querySelector('.doc-viewer-close').focus();
        }
    }

    function closeViewer() {
        overlay.classList.remove('is-open');
        frame.src = '';
        document.removeEventListener('keydown', onEscape);
        if (lastFocused) {
            lastFocused.focus();
            lastFocused = null;
        }
    }

    function checkAndOpen(url) {
        var ext = getExtension(url);

        fetch(url, { method: 'HEAD' })
            .then(function (res) {
                if (!res.ok) {
                    window.showToast('Document indisponible. Veuillez me contacter.', 'error', '#contact');
                    return;
                }
                if (PREVIEWABLE.indexOf(ext) === -1) {
                    window.showToast('Ce format ne peut pas être prévisualisé. Téléchargez le fichier.', 'warning');
                    return;
                }
                openViewer(url);
            })
            .catch(function () {
                window.showToast('Document indisponible. Veuillez me contacter.', 'error', '#contact');
            });
    }

    function injectModal() {
        overlay = document.createElement('div');
        overlay.id = 'doc-viewer-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Aperçu du document');

        var panel = document.createElement('div');
        panel.className = 'doc-viewer-panel';

        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'doc-viewer-close';
        closeBtn.setAttribute('aria-label', 'Fermer l\'aperçu');
        closeBtn.textContent = '\u00d7';

        frame = document.createElement('iframe');
        frame.className = 'doc-viewer-frame';
        frame.setAttribute('title', 'Aperçu du document');

        panel.appendChild(closeBtn);
        panel.appendChild(frame);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        closeBtn.addEventListener('click', closeViewer);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) { closeViewer(); }
        });
    }

    function makeViewerBtn(url) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-outline viewer-btn';
        btn.setAttribute('aria-label', 'Aperçu du document');

        var ns  = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2.5');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.setAttribute('aria-hidden', 'true');

        var path = document.createElementNS(ns, 'path');
        path.setAttribute('d', 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z');

        var circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', '12');
        circle.setAttribute('cy', '12');
        circle.setAttribute('r', '3');

        svg.appendChild(path);
        svg.appendChild(circle);

        var label = document.createElement('span');
        label.textContent = 'Aperçu';

        btn.appendChild(svg);
        btn.appendChild(label);

        btn.addEventListener('click', function () {
            checkAndOpen(url);
        });

        return btn;
    }

    function initViewButtons() {
        var links = document.querySelectorAll('a[data-viewable]');
        for (var i = 0; i < links.length; i++) {
            var anchor = links[i];
            var url    = anchor.getAttribute('href');
            var group  = document.createElement('div');
            group.className = 'doc-btn-group';

            anchor.parentNode.insertBefore(group, anchor);
            group.appendChild(anchor);
            group.appendChild(makeViewerBtn(url));
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        injectModal();
        initViewButtons();
    });
}());
