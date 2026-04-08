(function () {
    'use strict';

    var viewerOverlay = null;
    var viewerFrame   = null;
    var viewerFocused = null;

    var pickerOverlay = null;
    var pickerBase    = null;

    function onEscapeViewer(e) {
        if (e.key === 'Escape') { closeViewer(); }
    }

    function onEscapePicker(e) {
        if (e.key === 'Escape') { closePicker(); }
    }

    function openViewer(fileUrl) {
        var viewerBase = new URL('viewer/pdfjs/web/viewer.html', window.location.href).href;
        var src = viewerBase + '?file=' + encodeURIComponent(fileUrl);
        console.log('[viewer] opening PDF.js with file:', fileUrl);
        viewerFrame.src = src;
        if (!viewerOverlay.classList.contains('is-open')) {
            viewerFocused = document.activeElement;
            viewerOverlay.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', onEscapeViewer);
            viewerOverlay.querySelector('.doc-viewer-close').focus();
        }
    }

    function closeViewer() {
        viewerOverlay.classList.remove('is-open');
        document.body.style.overflow = '';
        viewerFrame.src = '';
        document.removeEventListener('keydown', onEscapeViewer);
        if (viewerFocused) {
            viewerFocused.focus();
            viewerFocused = null;
        }
    }

    function openPicker(base) {
        pickerBase = base;
        if (!pickerOverlay.classList.contains('is-open')) {
            pickerOverlay.classList.add('is-open');
            document.addEventListener('keydown', onEscapePicker);
            pickerOverlay.querySelector('.doc-picker-pdf').focus();
        }
    }

    function closePicker() {
        pickerOverlay.classList.remove('is-open');
        document.removeEventListener('keydown', onEscapePicker);
        pickerBase = null;
    }

    function downloadFile(url) {
        var a = document.createElement('a');
        a.href = url;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function handleEye(base) {
        var pdfUrl  = new URL(base + '.pdf',  window.location.origin).href;
        var docxUrl = new URL(base + '.docx', window.location.origin).href;
        fetch(pdfUrl, { method: 'HEAD' })
            .then(function (pdfRes) {
                if (pdfRes.ok) {
                    openViewer(pdfUrl);
                    return;
                }
                fetch(docxUrl, { method: 'HEAD' })
                    .then(function (docxRes) {
                        if (docxRes.ok) {
                            window.showToast('Aperçu disponible uniquement en PDF. Utilisez le bouton de téléchargement.', 'warning');
                        } else {
                            window.showToast('Document indisponible. Veuillez me contacter.', 'error', '#contact');
                        }
                    })
                    .catch(function () {
                        window.showToast('Document indisponible. Veuillez me contacter.', 'error', '#contact');
                    });
            })
            .catch(function () {
                window.showToast('Document indisponible. Veuillez me contacter.', 'error', '#contact');
            });
    }

    function handleDownload(base) {
        var pdfUrl  = new URL(base + '.pdf',  window.location.origin).href;
        var docxUrl = new URL(base + '.docx', window.location.origin).href;
        var pdfCheck  = fetch(pdfUrl,  { method: 'HEAD' }).then(function (r) { return r.ok; }).catch(function () { return false; });
        var docxCheck = fetch(docxUrl, { method: 'HEAD' }).then(function (r) { return r.ok; }).catch(function () { return false; });

        Promise.all([pdfCheck, docxCheck]).then(function (results) {
            var hasPdf  = results[0];
            var hasDocx = results[1];

            if (hasPdf && hasDocx) {
                openPicker(base);
            } else if (hasPdf) {
                downloadFile(pdfUrl);
            } else if (hasDocx) {
                downloadFile(docxUrl);
            } else {
                window.showToast('Document indisponible. Veuillez me contacter.', 'error', '#contact');
            }
        });
    }

    function injectViewerModal() {
        viewerOverlay = document.createElement('div');
        viewerOverlay.id = 'doc-viewer-overlay';
        viewerOverlay.setAttribute('role', 'dialog');
        viewerOverlay.setAttribute('aria-modal', 'true');
        viewerOverlay.setAttribute('aria-label', 'Aperçu du document');

        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'doc-viewer-close';
        closeBtn.setAttribute('aria-label', 'Fermer l\'aperçu');
        closeBtn.textContent = '\u00d7';

        var panel = document.createElement('div');
        panel.className = 'doc-viewer-panel';

        viewerFrame = document.createElement('iframe');
        viewerFrame.className = 'doc-viewer-frame';
        viewerFrame.setAttribute('title', 'Aperçu du document');

        panel.appendChild(viewerFrame);
        viewerOverlay.appendChild(closeBtn);
        viewerOverlay.appendChild(panel);
        document.body.appendChild(viewerOverlay);

        closeBtn.addEventListener('click', closeViewer);
        viewerOverlay.addEventListener('click', function (e) {
            if (e.target === viewerOverlay) { closeViewer(); }
        });
    }

    function injectPickerModal() {
        pickerOverlay = document.createElement('div');
        pickerOverlay.id = 'doc-picker-overlay';
        pickerOverlay.setAttribute('role', 'dialog');
        pickerOverlay.setAttribute('aria-modal', 'true');
        pickerOverlay.setAttribute('aria-label', 'Choisissez un format');

        var card = document.createElement('div');
        card.className = 'doc-picker-card';

        var title = document.createElement('p');
        title.className = 'doc-picker-title';
        title.textContent = 'Choisissez un format';

        var actions = document.createElement('div');
        actions.className = 'doc-picker-actions';

        var pdfBtn = document.createElement('button');
        pdfBtn.type = 'button';
        pdfBtn.className = 'btn btn-primary doc-picker-pdf';
        pdfBtn.textContent = 'PDF';

        var docxBtn = document.createElement('button');
        docxBtn.type = 'button';
        docxBtn.className = 'btn btn-outline doc-picker-docx';
        docxBtn.textContent = 'DOCX';

        pdfBtn.addEventListener('click', function () {
            downloadFile(new URL(pickerBase + '.pdf',  window.location.origin).href);
            closePicker();
        });

        docxBtn.addEventListener('click', function () {
            downloadFile(new URL(pickerBase + '.docx', window.location.origin).href);
            closePicker();
        });

        actions.appendChild(pdfBtn);
        actions.appendChild(docxBtn);
        card.appendChild(title);
        card.appendChild(actions);
        pickerOverlay.appendChild(card);
        document.body.appendChild(pickerOverlay);

        pickerOverlay.addEventListener('click', function (e) {
            if (e.target === pickerOverlay) { closePicker(); }
        });
    }

    function makeEyeBtn(base) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-outline doc-eye-btn';
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

        var eyePath = document.createElementNS(ns, 'path');
        eyePath.setAttribute('d', 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z');

        var eyeCircle = document.createElementNS(ns, 'circle');
        eyeCircle.setAttribute('cx', '12');
        eyeCircle.setAttribute('cy', '12');
        eyeCircle.setAttribute('r', '3');

        svg.appendChild(eyePath);
        svg.appendChild(eyeCircle);

        var label = document.createElement('span');
        label.textContent = 'Aperçu';

        btn.appendChild(svg);
        btn.appendChild(label);

        btn.addEventListener('click', function () {
            handleEye(base);
        });

        return btn;
    }

    function makeDownloadBtn(base) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-outline doc-download-btn';
        btn.setAttribute('aria-label', 'Télécharger le document');

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

        var dlPath = document.createElementNS(ns, 'path');
        dlPath.setAttribute('d', 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4');

        var dlPolyline = document.createElementNS(ns, 'polyline');
        dlPolyline.setAttribute('points', '7 10 12 15 17 10');

        var dlLine = document.createElementNS(ns, 'line');
        dlLine.setAttribute('x1', '12');
        dlLine.setAttribute('y1', '15');
        dlLine.setAttribute('x2', '12');
        dlLine.setAttribute('y2', '3');

        svg.appendChild(dlPath);
        svg.appendChild(dlPolyline);
        svg.appendChild(dlLine);

        var label = document.createElement('span');
        label.textContent = 'Télécharger';

        btn.appendChild(svg);
        btn.appendChild(label);

        btn.addEventListener('click', function () {
            handleDownload(base);
        });

        return btn;
    }

    function initDocButtons() {
        var anchors = document.querySelectorAll('a[data-doc]');
        for (var i = 0; i < anchors.length; i++) {
            var anchor = anchors[i];
            var base   = anchor.getAttribute('data-doc');
            var group  = document.createElement('div');
            group.className = 'doc-btn-group';

            anchor.parentNode.insertBefore(group, anchor);
            group.appendChild(makeEyeBtn(base));
            group.appendChild(makeDownloadBtn(base));
            anchor.parentNode.removeChild(anchor);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        injectViewerModal();
        injectPickerModal();
        initDocButtons();
    });
}());
