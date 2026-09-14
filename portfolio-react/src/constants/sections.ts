// Order matters: i18n nav arrays are aligned to this list by index.
export interface SectionDef {
  id: string;
  labelFr: string;
}

export const SECTIONS: SectionDef[] = [
  { id: 'accueil', labelFr: 'Accueil' },
  { id: 'profil', labelFr: 'Profil' },
  { id: 'parcours', labelFr: 'Parcours' },
  { id: 'competences', labelFr: 'Compétences' },
  { id: 'certifications', labelFr: 'Certifications' },
  { id: 'projets', labelFr: 'Projets' },
  { id: 'veille', labelFr: 'Veille' },
  { id: 'contact', labelFr: 'Contact' },
];
