export type Lang = 'fr' | 'en';

export interface Translation {
  // Aligned by index to SECTIONS in src/constants/sections.ts — do not reorder.
  nav: string[];
  heroSubtitle: string;
  heroDesc: string;
  statLabels: string[];
  footerCopy: string;
  backToTop: string;
}

export const translations: Record<Lang, Translation> = {
  fr: {
    nav: ['Accueil', 'Profil', 'Parcours', 'Compétences', 'Certifications', 'Projets', 'Veille', 'Contact'],
    heroSubtitle: 'Étudiant BTS SIO · Option SISR · Infrastructure & Cybersécurité',
    heroDesc:
      "Passionné par l'infrastructure IT, les réseaux et la cybersécurité.\nEn alternance et futur aspirant de l'Armée de l'air française.",
    statLabels: ['Projets réalisés', 'Technologies', "Ans d'études", 'Motivation'],
    footerCopy: '© 2025–2026 Leseigneur Léo — Tous droits réservés',
    backToTop: 'Retour en haut de page',
  },
  en: {
    nav: ['Home', 'Profile', 'Background', 'Skills', 'Certifications', 'Projects', 'Research', 'Contact'],
    heroSubtitle: 'BTS SIO Student · SISR Track · Infrastructure & Cybersecurity',
    heroDesc:
      'Passionate about IT infrastructure, networking and cybersecurity.\nWork-study student and aspiring French Air Force officer.',
    statLabels: ['Projects completed', 'Technologies', 'Years of study', 'Motivation'],
    footerCopy: '© 2025–2026 Leseigneur Léo — All rights reserved',
    backToTop: 'Back to top',
  },
};
