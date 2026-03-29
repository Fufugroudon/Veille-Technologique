# CLAUDE.md

This file provides guidance for AI assistants working in this repository.

## Project Overview

This is **Leseigneur Léo**'s personal academic project for the **BTS SIO SISR** (Services Informatiques aux Organisations — Solutions d'Infrastructure, Systèmes et Réseaux) program at Lycée Saint-Esprit, Beauvais.

The repository serves two purposes:
1. **Veille Technologique** (Technology Watch): Structured research on quantum computers vs. classical computers, focusing on cybersecurity and practical applications.
2. **Portfolio Web**: A static HTML/CSS personal portfolio website.

## Repository Structure

```
/
├── CLAUDE.md                  # This file
├── README.md                  # Student info and project description
├── Articles/
│   ├── 1&2.md                 # Articles 1 & 2: Quantum security & cryptography
│   └── 3&4.md                 # Articles 3 & 4: Quantum chip design & healthcare
└── Portfolio/
    ├── index.html             # Single-page portfolio website
    └── styles.css             # Portfolio stylesheet
```

## Technology Stack

This is a **pure static web project** — no build system, no package manager, no frameworks:

- **HTML5** — semantic structure, single-page layout with anchor navigation
- **CSS3** — custom properties, Flexbox, CSS Grid, responsive design
- **Markdown** — article/research documentation

There is no JavaScript logic (navigation uses CSS/anchor links), no Node.js, no Python, no backend, and no test suite.

## Content: Veille Technologique

The research subject is: **"Les différences entre les ordinateurs quantiques et les ordinateurs classiques"** (Differences between quantum computers and classical computers), with a focus on cybersecurity.

### Article Files Convention

Each `.md` file in `Articles/` contains:
1. A **heading** stating the research objective for that pair of articles
2. A **Markdown table** evaluating sources across 7 criteria (credibility, reliability, objectivity, accuracy, currency, relevance — scored 1–4)
3. An **"Analyse comparative"** section with bullet-point summaries per article
4. A **"Synthèse"** section synthesizing both articles

### Source Evaluation Criteria (in French)
| Column | Meaning |
|---|---|
| Sources d'information | Source URL and author details |
| Crédibilité de l'auteur | Author credibility (1–4) |
| Fiabilité de la source | Source reliability (1–4) |
| Objectivité de l'information | Objectivity (1–4) |
| Exactitude de l'information | Accuracy (1–4) |
| Actualité de l'information | Currency/recency (1–4) |
| Pertinence de l'information | Relevance (1–4) |

### Articles Covered (as of March 2026)

**1&2.md** — Cybersecurity & Cryptography:
- Penn State (Jan 2026): Hardware/software vulnerabilities in quantum computers
- MIT (Aug 2024): Improved quantum factorization algorithm toward breaking RSA encryption

**3&4.md** — Development & Applications:
- Berkeley Lab (Mar 2026): ARTEMIS tool — quantum chip simulation using 7000 GPUs on Perlmutter supercomputer
- MIT Technology Review (Mar 2026): Q4Bio Challenge ($5M prize for quantum healthcare applications)

## Portfolio Website

The portfolio (`Portfolio/index.html`) is a **single-page application** with anchor-based navigation. It is written entirely in French.

### Sections
| Anchor | Content |
|---|---|
| `#accueil` | Hero section with stats |
| `#profil` | Personal profile and CV download link |
| `#parcours` | Educational timeline |
| `#competences` | Skills with progress bars (4 categories) |
| `#projets` | 6 project cards |
| `#veille` | Quantum vs classical computer comparison |
| `#contact` | Contact form and social links |

### CSS Design System

Custom properties defined in `styles.css`:
- `--primary`: dark navy background
- `--secondary`: slightly lighter navy
- `--accent` / `--accent-light`: blue accent (#2563eb / #3b82f6)
- `--text` / `--text-secondary`: white and muted text

Design patterns:
- **Navigation**: Fixed, glassmorphism (`backdrop-filter: blur`)
- **Cards**: Hover with `transform: translateY(-5px)` and enhanced `box-shadow`
- **Transitions**: `0.3s ease` throughout
- **Responsive breakpoints**: 768px (tablet) and 400px (small mobile)
- **Layout**: CSS Grid for multi-column sections, Flexbox for components
- Units: `rem` for spacing, `px` for small details

### HTML Conventions
- Semantic HTML5 (`<nav>`, `<section>`, `<footer>`)
- Class naming is descriptive but not strict BEM (e.g. `nav-brand`, `skill-category`, `project-card`)
- All text content is in **French**
- Heading hierarchy: `<h1>` once per page, `<h2>` for sections, `<h3>` for subsections

## Development Workflow

### No Build Step
Just edit files directly. The portfolio can be opened with any browser (`file://`) or served with any static server.

### Git Conventions
- Commits are in **English** (e.g. `Add articles`, `Fix README title`)
- Branch: `claude/add-claude-documentation-nnkIw` is the active development branch
- GPG/SSH commit signing is enabled — do not bypass it
- Remote: `Fufugroudon/Veille-Technologique` on GitHub

### Adding New Articles
1. Create or update a file in `Articles/` (follow the `N&M.md` naming convention)
2. Use the established table format with all 7 evaluation columns
3. Follow each table with `## Analyse comparative` and `## Synthèse` sections
4. Keep all content in **French**

### Updating the Portfolio
- All changes go in `Portfolio/index.html` and `Portfolio/styles.css`
- Do not introduce JavaScript dependencies or build tools
- Maintain the French-language content
- Keep the dark navy/blue color scheme consistent with existing CSS variables

## Key Conventions for AI Assistants

- **Language**: All user-facing content (HTML, articles) is in French. Keep it French.
- **No dependencies**: Do not introduce npm, bundlers, frameworks, or any build tooling.
- **Static only**: This is a portfolio/documentation site — no backend, no API calls, no dynamic data.
- **Naming**: Article files follow the `N&M.md` pattern (e.g. `5&6.md` for the next pair).
- **Formatting**: Articles use Markdown tables; maintain consistent column order.
- **Scoring**: Source evaluation scores are integers 1–4; always justify scores in the table cells.
- **Branch**: Always work on and push to `claude/add-claude-documentation-nnkIw` unless instructed otherwise.
