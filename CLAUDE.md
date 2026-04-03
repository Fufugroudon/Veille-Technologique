# CLAUDE.md

This file provides guidance for AI assistants working in this repository.

## Skills
Additional context and conventions are available in `.claude/skills/veille-techno-web.md`. Read it when working on the portfolio, articles, or any web-related task.

## Project Overview

Personal academic project by **Leseigneur Léo** for **BTS SIO SISR** at **Ensitech, Cergy**.

Two purposes:
1. **Veille Technologique**: Structured research on quantum computers vs. classical computers, focusing on cybersecurity.
2. **Portfolio Web**: Personal portfolio on `lesnorrys.com`, evolving from static to full-stack.

**Hosting**: o2switch (shared hosting, Apache, cPanel) — no root access, no Docker, no Node.js server-side runtime, no containerized runtimes. PHP 8.x via cPanel, URL rewriting via `.htaccess`, cron jobs via cPanel, MySQL/MariaDB only.

## Repository Structure

```
/
├── CLAUDE.md
├── README.md
├── Articles/
│   ├── 1&2.md
│   └── 3&4.md
└── Portfolio/
    ├── index.html
    └── styles.css
```

## Technology Stack

| Layer | Current (v1) | Planned (v2+) |
|---|---|---|
| **Frontend** | HTML5, CSS3 | + TypeScript, JavaScript |
| **Backend** | — | PHP (OOP, PSR-12) |
| **Database** | — | MySQL/MariaDB (SQL) |

- TypeScript must be compiled to JS before deployment — no runtime TS on o2switch.
- Additional languages/modules may be added as the project evolves.
- Front-end frameworks (React, Vue) and CSS-in-JS are allowed when introduced.

## Code Quality

- PHP: PSR-12. JS/TS: ESLint-compatible.
- Strict separation of concerns: HTML in `.html`/`.php`, CSS in `.css`, JS/TS in `.js`/`.ts`. No inline styles or scripts. Exception: CSS-in-JS and single-file components allowed with front-end frameworks.
- No comments in HTML and CSS files.
- Human-readable code: clear and meaningful names for variables, functions, and classes. Avoid over-engineering. Prefer simple solutions.
- Code must be clean, maintainable, and built for long-term growth.
- All user-facing content is in **French**.

## Security

- All SQL queries must use prepared statements (PDO or MySQLi). No raw user input in queries.
- All user inputs must be validated server-side.
- Credentials and API keys must never be hardcoded — use `.env` excluded via `.gitignore`.
- A `.env.example` with placeholder values must be kept versioned.

## Veille Technologique — Article Conventions

**Subject**: Differences between quantum and classical computers, with a focus on cybersecurity.

Each `.md` file in `Articles/` contains:
1. A heading stating the research objective
2. A Markdown table evaluating sources across 7 criteria (scored 1–4)
3. `## Analyse comparative` — bullet-point summaries per article
4. `## Synthèse` — synthesis of both articles

**Evaluation table columns:**
| Column | Meaning |
|---|---|
| Sources d'information | Source URL and author |
| Crédibilité de l'auteur | Author credibility (1–4) |
| Fiabilité de la source | Source reliability (1–4) |
| Objectivité de l'information | Objectivity (1–4) |
| Exactitude de l'information | Accuracy (1–4) |
| Actualité de l'information | Currency/recency (1–4) |
| Pertinence de l'information | Relevance (1–4) |

Article files follow the `N&M.md` naming convention (e.g. `5&6.md` for the next pair).

## Portfolio Conventions

- Single-page, anchor-based navigation. All content in **French**.
- Dark navy/blue color scheme — keep consistent with existing CSS variables.
- Responsive: must work on all device types (PC, smartphone, tablet).
- **Current static version**: do not introduce npm, bundlers, frameworks, or build tooling.
- **Future full-stack**: PHP + MySQL + vanilla JS/TS target stack.

## Git & Workflow

- All messages and commits must be in **English**, imperative mood (e.g. `Add RSS feed parser`).
- Each commit must be atomic — one logical change per commit.
- GPG/SSH commit signing is enabled — do not bypass it.
- Never push directly to `main`.
- Push to `dev` only when explicitly instructed.

| Branch | Purpose |
|---|---|
| `main` | Production — stable, merged content only |
| `dev` | Léo's personal development branch |
| `claude-workflow` | Claude AI automated contributions |

## Key Conventions

- All work is carried out via prompts given to Claude Code.
- Code comments and technical documentation in **English**. UI content in **French**.
- Always work on and push to `claude-workflow` unless instructed otherwise.
- Production domain: `lesnorrys.com`, hosted on o2switch.
- Do not refactor the overall architecture, switch any part of the tech stack, or delete files without explicit instruction. Suggestions are welcome, but no structural change should be applied autonomously.