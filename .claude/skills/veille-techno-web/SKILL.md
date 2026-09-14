---
name: veille-techno-web
description: Conventions for writing Veille Technologique articles (Articles/*.md source-evaluation format) and for the Portfolio Web (static vanilla site and its portfolio-react migration). Use when working on files under Articles/, Portfolio/, or portfolio-react/.
---

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
- **`Portfolio/` (static v1)**: do not introduce npm, bundlers, frameworks, or build tooling — this tree stays plain HTML/CSS/JS as a fallback.
- **`portfolio-react/` (v2)**: the React/TypeScript/Vite migration target. npm, bundlers, and front-end frameworks are expected here.
- **Future full-stack**: PHP + MySQL backend target stack.
