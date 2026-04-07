# Document Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a view button next to each opted-in download link that previews the document in a fullscreen iframe modal, with availability and format checks falling back to toast notifications.

**Architecture:** A `data-viewable` attribute on download anchors opts them into the viewer. `viewer.js` injects a singleton modal and wraps each marked anchor in a flex group with a view button. Clicking the button runs a `fetch` HEAD check, then either opens the modal or shows a toast via the existing `window.showToast` API.

**Tech Stack:** Vanilla JS (ES5-compatible IIFE), CSS custom properties, existing `window.showToast` from `toast/toast.js`, native `<iframe>` for PDF rendering.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `Portfolio/viewer/viewer.css` | Create | All viewer styles — overlay, panel, close button, button group |
| `Portfolio/viewer/viewer.js` | Create | Modal injection, view button injection, availability check, open/close logic |
| `Portfolio/index.html` | Modify | Add `data-viewable` to 2 anchors; link viewer.css; script viewer.js |

---

### Task 1: Create viewer.css

**Files:**
- Create: `Portfolio/viewer/viewer.css`

- [ ] **Step 1: Create the file with all viewer styles**

```css
.doc-btn-group {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

#doc-viewer-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(6, 13, 26, 0.96);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

#doc-viewer-overlay.is-open {
  opacity: 1;
  pointer-events: auto;
}

.doc-viewer-panel {
  position: relative;
  width: 90vw;
  height: 90vh;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.doc-viewer-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 1;
  background: rgba(6, 13, 26, 0.7);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 1.25rem;
  line-height: 1;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--t-fast), color var(--t-fast);
}

.doc-viewer-close:hover {
  background: var(--accent);
  color: #fff;
}

.doc-viewer-frame {
  width: 100%;
  flex: 1;
  border: none;
}
```

- [ ] **Step 2: Verify the file exists**

```bash
ls Portfolio/viewer/viewer.css
```

Expected: file listed with no error.

- [ ] **Step 3: Commit**

```bash
git add Portfolio/viewer/viewer.css
git commit -m "Add document viewer CSS"
```

---

### Task 2: Create viewer.js

**Files:**
- Create: `Portfolio/viewer/viewer.js`

The file is a single IIFE. It must be created in one step — the functions call each other and none of them work in isolation.

- [ ] **Step 1: Create the file**

```javascript
(function () {
    'use strict';

    var overlay = null;
    var frame   = null;

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
        overlay.classList.add('is-open');
        document.addEventListener('keydown', onEscape);
    }

    function closeViewer() {
        overlay.classList.remove('is-open');
        frame.src = '';
        document.removeEventListener('keydown', onEscape);
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
        frame.setAttribute('allowfullscreen', '');

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
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg><span>Aperçu</span>';

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
```

- [ ] **Step 2: Verify the file exists**

```bash
ls Portfolio/viewer/viewer.js
```

Expected: file listed with no error.

- [ ] **Step 3: Commit**

```bash
git add Portfolio/viewer/viewer.js
git commit -m "Add document viewer JS"
```

---

### Task 3: Update index.html

**Files:**
- Modify: `Portfolio/index.html`

Three changes in `index.html`:

**1. Link viewer.css** — add after the existing `toast/toast.css` link (line 25):

- [ ] **Step 1: Add the CSS link**

Find this line:
```html
  <link rel="stylesheet" href="toast/toast.css">
```

Replace with:
```html
  <link rel="stylesheet" href="toast/toast.css">
  <link rel="stylesheet" href="viewer/viewer.css">
```

**2. Add `data-viewable` to the CV anchor** (currently line 142):

- [ ] **Step 2: Mark the CV anchor**

Find:
```html
          <a href="/docs/Léo_CV.pdf" download class="btn btn-primary cv-btn">
```

Replace with:
```html
          <a href="/docs/Léo_CV.pdf" download data-viewable class="btn btn-primary cv-btn">
```

**3. Add `data-viewable` to the AD documentation anchor** (currently line 453):

- [ ] **Step 3: Mark the AD documentation anchor**

Find:
```html
            <a href="/docs/AD-Documentation-Leo.docx" download class="btn btn-outline project-download-btn">
```

Replace with:
```html
            <a href="/docs/AD-Documentation-Leo.docx" download data-viewable class="btn btn-outline project-download-btn">
```

**4. Add the viewer.js script tag** — add after `script.js` before `</body>` (currently line 679):

- [ ] **Step 4: Add the script tag**

Find:
```html
  <script src="toast/toast.js" defer></script>
  <script src="nav.js" defer></script>
  <script src="script.js" defer></script>
```

Replace with:
```html
  <script src="toast/toast.js" defer></script>
  <script src="nav.js" defer></script>
  <script src="script.js" defer></script>
  <script src="viewer/viewer.js" defer></script>
```

- [ ] **Step 5: Commit**

```bash
git add Portfolio/index.html
git commit -m "Wire document viewer into index.html"
```

---

### Task 4: Manual verification

No automated test framework is present. Verify in browser against the live files.

- [ ] **Step 1: Verify view buttons appear**

Open `Portfolio/index.html` in a browser (or via local server). Check:
- A view button with an eye icon and "Aperçu" text appears to the right of the CV download button in `#profil`.
- A view button appears to the right of the "Télécharger la documentation" button in the Active Directory card in `#projets`.
- Both download and view buttons are inline, same height, same border-radius.

- [ ] **Step 2: Verify modal open/close**

Click the view button next to the CV (PDF). Expect:
- Modal fades in over 0.3s.
- iframe loads `/docs/Léo_CV.pdf#toolbar=0`.
- Close button (×) is visible top-right.

Close the modal via:
- The × button — modal fades out, iframe src is cleared.
- The `Escape` key — same result.
- Clicking outside the panel (on the dark overlay) — same result.

- [ ] **Step 3: Verify non-previewable format toast**

Click the view button next to the AD documentation (`.docx`). Expect:
- The fetch HEAD request completes (file exists on server).
- Toast appears: *"Ce format ne peut pas être prévisualisé. Téléchargez le fichier."* with a warning style.
- Modal does NOT open.

- [ ] **Step 4: Verify unavailability toast (simulate)**

Temporarily change the `href` on a `[data-viewable]` anchor to a non-existent URL (e.g. `/docs/fake.pdf`), reload, and click its view button. Expect:
- Toast: *"Document indisponible. Veuillez me contacter."* with error style and "→ En savoir plus" link that scrolls to `#contact`.
- Revert the href change after verifying.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "Verify document viewer implementation"
```

Push to `claude-workflow`:

```bash
git push origin claude-workflow
```
