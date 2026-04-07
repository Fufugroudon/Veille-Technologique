# Document Viewer — Design Spec
**Date:** 2026-04-07
**Status:** Approved

## Overview

Add an integrated document viewer to the portfolio site so users can preview downloadable files directly in the browser without downloading them. A view button appears next to every opted-in download link. Clicking it checks availability, then either opens a fullscreen modal viewer or shows a toast notification.

## Scope

- Add view buttons next to download anchors marked with `data-viewable`.
- Build a fullscreen iframe-based modal viewer matching the site's dark navy aesthetic.
- Use `fetch()` HEAD requests to check document availability before opening.
- Show contextual toasts for unavailable or non-previewable documents.
- All new code goes in `Portfolio/viewer/` (CSS + JS). No inline styles or scripts.

## Files Changed

| File | Change |
|---|---|
| `Portfolio/index.html` | Add `data-viewable` to 2 anchors; link `viewer/viewer.css`; script `viewer/viewer.js` |
| `Portfolio/viewer/viewer.css` | All new viewer styles |
| `Portfolio/viewer/viewer.js` | All new viewer logic (IIFE, strict mode) |
| `Portfolio/styles.css` | Untouched |
| `Portfolio/toast/toast.js` | Untouched |

## HTML Changes

Add `data-viewable` attribute to the two existing download anchors:

```html
<!-- #profil — CV -->
<a href="/docs/Léo_CV.pdf" download data-viewable class="btn btn-primary cv-btn">…</a>

<!-- #projets — AD documentation -->
<a href="/docs/AD-Documentation-Leo.docx" download data-viewable class="btn btn-outline project-download-btn">…</a>
```

The viewer modal is injected entirely by JS — nothing added to `index.html` for the modal itself.

## View Button

- Injected by `viewer.js` at `DOMContentLoaded` after each `[data-viewable]` anchor.
- Classes: `btn btn-outline viewer-btn` (inherits existing button styles from `styles.css`).
- Content: inline eye SVG icon + text "Aperçu".
- Both the download anchor and the new view button are wrapped in a `<div class="doc-btn-group">` flex container (gap between them, no layout shift).

## Modal Viewer

A singleton `<div id="doc-viewer-overlay">` injected into `<body>` on init.

**Structure:**
```
#doc-viewer-overlay          ← fixed full-viewport overlay
  .doc-viewer-panel          ← centered card, 90vw × 90vh max
    button.doc-viewer-close  ← top-right ×
    iframe.doc-viewer-frame  ← fills the panel
```

**Visual:**
- Overlay: `position: fixed`, full viewport, `z-index: 10000`, background `var(--dark)` at 96% opacity, subtle `backdrop-filter: blur(4px)`.
- Panel: dark card using `var(--bg-card)`, `var(--radius-lg)`, `var(--shadow)`.
- Close button: top-right corner, `×` character, inherits site font, hover opacity transition.
- Fade-in animation: `opacity 0 → 1`, `0.3s ease`.

**Close triggers:**
1. Click the `×` close button.
2. Press `Escape`.
3. Click outside the `.doc-viewer-panel` (on the overlay itself).

**On close:** `iframe.src` is set to `""` to stop any background loading.

## Availability & Format Check

```
View button clicked
  → fetch HEAD on document URL
  → if network error or status 4xx/5xx:
      showToast('Document indisponible. Veuillez me contacter.', 'error', '#contact')
  → else if extension NOT in [pdf, png, jpg, jpeg, gif, webp, svg]:
      showToast('Ce format ne peut pas être prévisualisé. Téléchargez le fichier.', 'warning')
  → else:
      open modal with iframe src = URL + '#toolbar=0'
```

Extension detection is done from the URL pathname (lowercase, split on `.`).

## Toast Integration

Uses the existing `window.showToast(message, type, linkTarget)` API from `toast/toast.js` without modification.

- Unavailable document: type `'error'`, linkTarget `'#contact'` (renders "→ En savoir plus" scroll link to contact section).
- Non-previewable format: type `'warning'`, no linkTarget.

Note: the linkTarget renders "→ En savoir plus" (existing toast API behavior), not an inline "contacter" hyperlink as originally described in the prompt. This is an intentional trade-off to avoid modifying `toast.js`.

## Design System Alignment

- Button classes reuse existing `.btn.btn-outline` — no new button styles needed beyond sizing.
- CSS variables used throughout: `var(--dark)`, `var(--bg-card)`, `var(--accent)`, `var(--radius-lg)`, `var(--shadow)`, `var(--t)`.
- All UI text in French.
- No inline styles, no inline scripts, no comments in HTML or CSS.

## Previewable Formats

| Extension | Viewable |
|---|---|
| pdf | Yes |
| png, jpg, jpeg, gif, webp, svg | Yes |
| docx, doc, zip, etc. | No — toast shown |

## Non-Goals

- No zoom, print, or download controls inside the viewer.
- No support for multiple files open simultaneously.
- No changes to the toast system.
- No changes to `styles.css`.
