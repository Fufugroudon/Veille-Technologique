(function () {
    'use strict';

    var viewerOverlay = null;
    var viewerFrame   = null;
    var viewerFocused = null;

    var pickerOverlay = null;
    var pickerBase    = null;
    var pickerFiles   = null;

    var pickerPdfBtn  = null;
    var pickerDocxBtn = null;
    var pickerTable   = null;
    var pickerZipBtn  = null;
    var pickerDetails = null;

    function onEscapeViewer(e) {
        if (e.key === 'Escape') { closeViewer(); }
    }

    function onEscapePicker(e) {
        if (e.key === 'Escape') { closePicker(); }
    }

    function openViewer(fileUrl) {
        var viewerBase = new URL('viewer/pdfjs/web/viewer.html', window.location.href).href;
        var src = viewerBase + '?file=' + encodeURIComponent(fileUrl) + '&page=1';
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

    function formatSize(bytes) {
        if (!bytes || bytes <= 0) { return '\u2014'; }
        if (bytes < 1048576) { return (bytes / 1024).toFixed(1) + '\u00a0KB'; }
        return (bytes / 1048576).toFixed(2) + '\u00a0MB';
    }

    function openPicker(base, files) {
        pickerBase  = base;
        pickerFiles = files;

        var hasPdf  = files.filter(function (f) { return f.ext === 'pdf';  }).length > 0;
        var hasDocx = files.filter(function (f) { return f.ext === 'docx'; }).length > 0;

        pickerPdfBtn.style.display  = hasPdf  ? '' : 'none';
        pickerDocxBtn.style.display = hasDocx ? '' : 'none';

        while (pickerTable.firstChild) {
            pickerTable.removeChild(pickerTable.firstChild);
        }
        files.forEach(function (f) {
            var tr    = document.createElement('tr');
            var cells = [f.name, f.ext.toUpperCase(), f.mime || '\u2014', formatSize(f.sizeBytes)];
            cells.forEach(function (text) {
                var td = document.createElement('td');
                td.textContent = text;
                tr.appendChild(td);
            });
            pickerTable.appendChild(tr);
        });

        pickerDetails.removeAttribute('open');

        if (!pickerOverlay.classList.contains('is-open')) {
            pickerOverlay.classList.add('is-open');
            document.addEventListener('keydown', onEscapePicker);
            (hasPdf ? pickerPdfBtn : pickerDocxBtn).focus();
        }
    }

    function closePicker() {
        pickerOverlay.classList.remove('is-open');
        document.removeEventListener('keydown', onEscapePicker);
        pickerBase  = null;
        pickerFiles = null;
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
                            window.showToast('Visualisation disponible uniquement en PDF. Utilisez le bouton de t\u00e9l\u00e9chargement.', 'warning');
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

    function probeFile(url, ext) {
        return fetch(url, { method: 'HEAD' })
            .then(function (r) {
                if (!r.ok) { return null; }
                return {
                    ext:       ext,
                    url:       url,
                    name:      url.split('/').pop(),
                    sizeBytes: parseInt(r.headers.get('Content-Length'), 10) || 0,
                    mime:      (r.headers.get('Content-Type') || '').split(';')[0].trim()
                };
            })
            .catch(function () { return null; });
    }

    function handleDownload(base) {
        var pdfUrl  = new URL(base + '.pdf',  window.location.origin).href;
        var docxUrl = new URL(base + '.docx', window.location.origin).href;

        Promise.all([probeFile(pdfUrl, 'pdf'), probeFile(docxUrl, 'docx')]).then(function (results) {
            var files = results.filter(function (f) { return f !== null; });

            if (files.length === 0) {
                window.showToast('Document indisponible. Veuillez me contacter.', 'error', '#contact');
            } else if (files.length === 1) {
                downloadFile(files[0].url);
            } else {
                openPicker(base, files);
            }
        });
    }

    function injectViewerModal() {
        viewerOverlay = document.createElement('div');
        viewerOverlay.id = 'doc-viewer-overlay';
        viewerOverlay.setAttribute('role', 'dialog');
        viewerOverlay.setAttribute('aria-modal', 'true');
        viewerOverlay.setAttribute('aria-label', 'Visualiser le document');

        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'doc-viewer-close';
        closeBtn.setAttribute('aria-label', 'Fermer le visualiseur');
        closeBtn.textContent = '\u00d7';

        var panel = document.createElement('div');
        panel.className = 'doc-viewer-panel';

        viewerFrame = document.createElement('iframe');
        viewerFrame.className = 'doc-viewer-frame';
        viewerFrame.setAttribute('title', 'Visualiser le document');

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
        pickerOverlay.setAttribute('aria-label', 'S\u00e9lectionner le format');

        var card = document.createElement('div');
        card.className = 'doc-picker-card';

        var header = document.createElement('div');
        header.className = 'doc-picker-header';

        var title = document.createElement('p');
        title.className = 'doc-picker-title';
        title.textContent = 'S\u00e9lectionner le format du document \u00e0 t\u00e9l\u00e9charger\u00a0:';

        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'doc-picker-close';
        closeBtn.setAttribute('aria-label', 'Fermer');
        closeBtn.textContent = '\u00d7';
        closeBtn.addEventListener('click', closePicker);

        header.appendChild(title);
        header.appendChild(closeBtn);

        var actions = document.createElement('div');
        actions.className = 'doc-picker-actions';

        pickerPdfBtn = document.createElement('button');
        pickerPdfBtn.type = 'button';
        pickerPdfBtn.className = 'btn btn-outline doc-picker-pdf';
        pickerPdfBtn.textContent = 'PDF';
        pickerPdfBtn.title = 'T\u00e9l\u00e9charger ce document en format PDF (.pdf).';

        pickerDocxBtn = document.createElement('button');
        pickerDocxBtn.type = 'button';
        pickerDocxBtn.className = 'btn btn-outline doc-picker-docx';
        pickerDocxBtn.textContent = 'DOCX';
        pickerDocxBtn.title = 'T\u00e9l\u00e9charger ce document en format WORD (.docx).';

        pickerPdfBtn.addEventListener('click', function () {
            var f = pickerFiles && pickerFiles.filter(function (f) { return f.ext === 'pdf'; })[0];
            if (f) { downloadFile(f.url); }
            closePicker();
        });

        pickerDocxBtn.addEventListener('click', function () {
            var f = pickerFiles && pickerFiles.filter(function (f) { return f.ext === 'docx'; })[0];
            if (f) { downloadFile(f.url); }
            closePicker();
        });

        actions.appendChild(pickerPdfBtn);
        actions.appendChild(pickerDocxBtn);

        pickerDetails = document.createElement('details');
        pickerDetails.className = 'doc-picker-details';

        var summary = document.createElement('summary');
        summary.className = 'doc-picker-summary';
        summary.textContent = 'D\u00e9tails des fichiers';

        var tableWrap = document.createElement('div');
        tableWrap.className = 'doc-picker-table-wrap';

        var table = document.createElement('table');
        table.className = 'doc-picker-table';

        var thead = document.createElement('thead');
        var headRow = document.createElement('tr');
        ['Nom du fichier', 'Format', 'Type', 'Taille'].forEach(function (h) {
            var th = document.createElement('th');
            th.textContent = h;
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);

        pickerTable = document.createElement('tbody');

        table.appendChild(thead);
        table.appendChild(pickerTable);
        tableWrap.appendChild(table);

        pickerZipBtn = document.createElement('button');
        pickerZipBtn.type = 'button';
        pickerZipBtn.className = 'btn btn-outline doc-picker-zip';
        pickerZipBtn.textContent = 'Tout t\u00e9l\u00e9charger';

        pickerZipBtn.addEventListener('click', function () {
            if (!pickerFiles || !pickerBase || typeof JSZip === 'undefined') { return; }
            var docName = pickerBase.split('/').pop();
            var zip = new JSZip();
            var fetches = pickerFiles.map(function (f) {
                return fetch(f.url)
                    .then(function (r) { return r.blob(); })
                    .then(function (blob) { zip.file(f.name, blob); });
            });
            Promise.all(fetches)
                .then(function () { return zip.generateAsync({ type: 'blob' }); })
                .then(function (content) {
                    var a = document.createElement('a');
                    a.href = URL.createObjectURL(content);
                    a.download = docName + ' - Folder.zip';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
                });
            closePicker();
        });

        pickerDetails.appendChild(summary);
        pickerDetails.appendChild(tableWrap);
        pickerDetails.appendChild(pickerZipBtn);

        card.appendChild(header);
        card.appendChild(actions);
        card.appendChild(pickerDetails);
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
        btn.setAttribute('aria-label', 'Visualiser le document');

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
        label.textContent = 'Visualiser';

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
        btn.setAttribute('aria-label', 'T\u00e9l\u00e9charger le document');

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
        label.textContent = 'T\u00e9l\u00e9charger';

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
            group.appendChild(makeDownloadBtn(base));
            group.appendChild(makeEyeBtn(base));
            anchor.parentNode.removeChild(anchor);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        injectViewerModal();
        injectPickerModal();
        initDocButtons();
    });
}());
