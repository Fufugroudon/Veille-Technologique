export type Lang = 'fr' | 'en';

interface TimelineEntryText {
  date: string;
  badge: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
}

interface SkillCategoryText {
  title: string;
  skills: string[];
}

interface CertFilterText {
  id: 'all' | 'langue' | 'reseau' | 'cloud' | 'securite' | 'methode' | 'mooc';
  label: string;
}

interface CertItemText {
  badgeLabel: string;
  title: string;
  issuer: string;
  description: string;
  level: string;
}

interface ProjectText {
  title: string;
  description: string;
}

interface FeatureRowText {
  label: string;
  value: string;
}

interface IconItemText {
  label: string;
}

export interface Translation {
  // Aligned by index to SECTIONS in src/constants/sections.ts — do not reorder.
  nav: string[];
  heroBadge: string;
  heroSubtitle: string;
  availabilityBadge: string;
  itecPrefix: string;
  heroDesc: string;
  heroCtaProjects: string;
  heroCtaContact: string;
  statLabels: string[];
  footerRole: string;
  footerCopy: string;
  termsLink: string;
  backToTop: string;
  navOpenMenu: string;
  navCloseMenu: string;
  navOpenTerminal: string;

  profil: {
    sectionSubtitle: string;
    heading: string;
    paragraphs: string[];
    tags: string[];
    docCvLabel: string;
    docTableauLabel: string;
  };

  parcours: {
    sectionSubtitle: string;
    entries: TimelineEntryText[];
  };

  competences: {
    sectionSubtitle: string;
    categories: SkillCategoryText[];
  };

  certifications: {
    sectionSubtitle: string;
    filters: CertFilterText[];
    items: CertItemText[];
  };

  projets: {
    sectionSubtitle: string;
    items: ProjectText[];
  };

  docActions: {
    download: string;
    downloadAria: string;
    view: string;
    viewAria: string;
  };

  veille: {
    sectionSubtitle: string;
    githubLabel: string;
    introPrefix: string;
    introStrong: string;
    classicTitle: string;
    quantumTitle: string;
    classicFeatures: FeatureRowText[];
    quantumFeatures: FeatureRowText[];
    domainesTitle: string;
    domaines: IconItemText[];
    sourcesTitle: string;
    sources: IconItemText[];
    methodesTitle: string;
    methodes: IconItemText[];
    conclusionTitle: string;
    conclusionText: string;
  };

  contact: {
    sectionSubtitle: string;
    heading: string;
    emailLabel: string;
    githubLabel: string;
    locationLabel: string;
    location: string;
    statusLabel: string;
    statusPrefix: string;
    statusSuffix: string;
  };

  terms: {
    title: string;
    accept: string;
    refuse: string;
    close: string;
  };
}

export const translations: Record<Lang, Translation> = {
  fr: {
    nav: ['Accueil', 'Profil', 'Parcours', 'Compétences', 'Certifications', 'Projets', 'Veille', 'Contact'],
    heroBadge: 'Disponible — Alternance BTS SIO SISR',
    heroSubtitle: 'Étudiant BTS SIO · Option SISR · Infrastructure & Cybersécurité',
    availabilityBadge: 'Disponible en alternance',
    itecPrefix: 'Alternant BTS SIO SISR chez',
    heroDesc:
      "Passionné par l'infrastructure IT, les réseaux et la cybersécurité.\nEn alternance et futur aspirant de l'Armée de l'air française.",
    heroCtaProjects: 'Voir mes projets',
    heroCtaContact: 'Me contacter',
    statLabels: ['Projets réalisés', 'Technologies', "Ans d'études", 'Motivation'],
    footerRole: 'Étudiant BTS SIO SISR',
    footerCopy: '© 2025–2026 Leseigneur Léo — Tous droits réservés',
    termsLink: "Conditions d'utilisation",
    backToTop: 'Retour en haut de page',
    navOpenMenu: 'Ouvrir le menu',
    navCloseMenu: 'Fermer le menu',
    navOpenTerminal: 'Ouvrir le terminal interactif',

    docActions: {
      download: 'Télécharger',
      downloadAria: 'Télécharger le document',
      view: 'Visualiser',
      viewAria: 'Visualiser le document',
    },

    profil: {
      sectionSubtitle: 'Qui suis-je ?',
      heading: 'Un étudiant passionné',
      paragraphs: [
        "Actuellement en BTS Services Informatiques aux Organisations option SISR (Solutions d'Infrastructure, Systèmes et Réseaux), je me spécialise dans l'administration système, la configuration réseau et la cybersécurité.",
        "Passionné par les jeux vidéo, le développement (C#, Python) et la mythologie, je combine mes intérêts techniques avec une vision stratégique de carrière : intégrer l'Armée de l'air française après un master (BAC+5) et créer ma propre entreprise dans le domaine IT.",
        'Je développe activement mes compétences via des certifications (Cisco, Microsoft, Google, Nvidia) et des projets pratiques en infrastructure.',
      ],
      tags: ['Infrastructure', 'Cybersécurité', 'Réseaux', 'Alternance', 'BAC+2'],
      docCvLabel: 'Curriculum Vitae',
      docTableauLabel: 'Tableau de Synthèse',
    },

    parcours: {
      sectionSubtitle: 'Mon chemin académique',
      entries: [
        {
          date: "Sept 2025 — Aujourd'hui",
          badge: 'En cours',
          title: 'BTS SIO — Option SISR',
          subtitle: 'BTS Services Informatiques aux Organisations',
          paragraphs: [
            'Ensitech, Cergy',
            "Option Solutions d'Infrastructure, Systèmes et Réseaux",
            "Formation en alternance axée sur l'administration système, la gestion réseau et la cybersécurité.",
          ],
        },
        {
          date: 'Sept 2022 — Juin 2025',
          badge: 'Obtenu avec mention',
          title: 'Baccalauréat Général',
          subtitle: 'Spécialités Scientifiques',
          paragraphs: [
            'Spécialités AMC (Anglais Monde Contemporain) et NSI (Numérique et Sciences Informatiques)',
            "Formation aux bases de l'informatique et de la programmation.",
          ],
        },
        {
          date: '2018 — 2022',
          badge: 'Obtenu avec mention',
          title: 'Collège',
          subtitle: 'Brevet des collèges',
          paragraphs: ['Obtention du diplôme national du brevet avec mention.'],
        },
      ],
    },

    competences: {
      sectionSubtitle: 'Mes expertises techniques',
      categories: [
        {
          title: 'Administration Système',
          skills: ['Linux (Debian, Ubuntu, Kali)', 'Windows Server', 'Virtualisation (VMware, Proxmox)'],
        },
        {
          title: 'Réseaux',
          skills: ['Configuration réseau (VLAN, routing)', 'Firewall (pfSense, iptables)', 'Services réseau (DNS, DHCP, VPN)'],
        },
        {
          title: 'Cybersécurité',
          skills: ['Audit de sécurité', 'Pentest (Kali, Nmap, Burp Suite)', 'SSL/TLS, certificats'],
        },
        {
          title: 'Développement & Scripts',
          skills: ['Bash / Shell scripting', 'Python', 'C#'],
        },
      ],
    },

    certifications: {
      sectionSubtitle: 'Mes accréditations et attestations',
      filters: [
        { id: 'all', label: 'Tous' },
        { id: 'langue', label: 'Langues' },
        { id: 'reseau', label: 'Réseau' },
        { id: 'cloud', label: 'Cloud & IA' },
        { id: 'securite', label: 'Sécurité' },
        { id: 'methode', label: 'Méthodes' },
        { id: 'mooc', label: 'MOOC' },
      ],
      items: [
        {
          badgeLabel: 'Langue',
          title: 'Cambridge English Certificate',
          issuer: 'Cambridge University Press & Assessment',
          description: "Attestation officielle de compétence en anglais délivrée par Cambridge.",
          level: 'B2 — Upper Intermediate',
        },
      ],
    },

    projets: {
      sectionSubtitle: 'Mes réalisations techniques',
      items: [
        {
          title: 'Serveur Web LAMP',
          description: "Déploiement d'un serveur Linux Apache MariaDB PHP avec backup automatisé et monitoring.",
        },
        {
          title: 'Infrastructure réseau VM',
          description: 'Configuration VMware complète avec routage VLAN, firewall pfSense et segmentation réseau.',
        },
        {
          title: 'Application Python',
          description:
            "Développement d'un outil Python pour différentes tâches. Tel que créer des comptes Admin Local, etc...",
        },
        {
          title: 'Maintenance code C#',
          description: "Correction de bugs et ajout de fonctionnalités sur une application de gestion.",
        },
        {
          title: 'Audit de sécurité',
          description: "Scan de vulnérabilités et tests d'intrusion sur infrastructure test avec Kali Linux.",
        },
        {
          title: 'Portfolio Web',
          description: 'Création de ce portfolio hébergé sur o2switch avec configuration Apache et SSL.',
        },
        {
          title: 'Active Directory & GPO',
          description:
            "Documentation technique E6 : configuration d'un annuaire Active Directory et de stratégies de groupes sur Windows Server 2025.",
        },
      ],
    },

    veille: {
      sectionSubtitle: 'Ordinateurs Quantiques vs Ordinateurs Classiques',
      githubLabel: 'Voir le dépôt GitHub',
      introPrefix: 'Mon sujet de veille technologique concerne la technologie quantique, plus précisément : ',
      introStrong: 'les réelles différences entre un ordinateur dit "Quantique" et un ordinateur dit "Classique"',
      classicTitle: 'Ordinateur Classique',
      quantumTitle: 'Ordinateur Quantique',
      classicFeatures: [
        { label: 'Unité', value: 'Bit (0 ou 1)' },
        { label: 'Technologie', value: 'Transistors' },
        { label: 'Traitement', value: 'Séquentiel' },
        { label: '💪 Avantage', value: 'Fiable et mature' },
      ],
      quantumFeatures: [
        { label: 'Unité', value: 'Qubit (0 et 1)' },
        { label: 'Technologie', value: 'Mécanique quantique' },
        { label: 'Traitement', value: 'Parallèle massif' },
        { label: '⚡ Avantage', value: 'Ultra-rapide' },
      ],
      domainesTitle: '🎯 Domaines Impactés',
      domaines: [{ label: 'Cryptographie' }, { label: 'Médecine' }, { label: 'IA' }, { label: 'Optimisation' }],
      sourcesTitle: '📚 Mes Sources',
      sources: [{ label: 'Recherche' }, { label: 'Industrie' }, { label: 'Formation' }, { label: 'Actualités' }],
      methodesTitle: '🔍 Mes Méthodes',
      methodes: [{ label: 'Flux RSS' }, { label: 'Feedly' }, { label: 'Communautés' }, { label: 'LinkedIn' }],
      conclusionTitle: '💡 Pourquoi ce Sujet ?',
      conclusionText:
        "L'informatique quantique impactera directement la cybersécurité et l'infrastructure. Cette veille me permet d'anticiper les évolutions du chiffrement et de préparer la transition vers l'ère post-quantique.",
    },

    contact: {
      sectionSubtitle: 'Restons en contact',
      heading: 'Mes coordonnées',
      emailLabel: 'Email',
      githubLabel: 'GitHub',
      locationLabel: 'Localisation',
      location: 'Beauvais, Hauts-de-France',
      statusLabel: 'Statut',
      statusPrefix: 'Étudiant en alternance BTS SIO SISR chez',
      statusSuffix: 'à Esches',
    },

    terms: {
      title: "Conditions d'utilisation",
      accept: "J'accepte",
      refuse: 'Refuser',
      close: 'Fermer',
    },
  },

  en: {
    nav: ['Home', 'Profile', 'Background', 'Skills', 'Certifications', 'Projects', 'Research', 'Contact'],
    heroBadge: 'Available — Work-study BTS SIO SISR',
    heroSubtitle: 'BTS SIO Student · SISR Track · Infrastructure & Cybersecurity',
    availabilityBadge: 'Available for a work-study position',
    itecPrefix: 'Work-study BTS SIO SISR student at',
    heroDesc:
      'Passionate about IT infrastructure, networking and cybersecurity.\nWork-study student and aspiring French Air Force officer.',
    heroCtaProjects: 'See my projects',
    heroCtaContact: 'Contact me',
    statLabels: ['Projects completed', 'Technologies', 'Years of study', 'Motivation'],
    footerRole: 'BTS SIO SISR Student',
    footerCopy: '© 2025–2026 Leseigneur Léo — All rights reserved',
    termsLink: 'Terms of use',
    backToTop: 'Back to top',
    navOpenMenu: 'Open menu',
    navCloseMenu: 'Close menu',
    navOpenTerminal: 'Open the interactive terminal',

    docActions: {
      download: 'Download',
      downloadAria: 'Download the document',
      view: 'View',
      viewAria: 'View the document',
    },

    profil: {
      sectionSubtitle: 'Who am I?',
      heading: 'A passionate student',
      paragraphs: [
        "Currently studying for a BTS in IT Services for Organizations, SISR track (Infrastructure, Systems and Network Solutions), specializing in system administration, network configuration and cybersecurity.",
        "Passionate about video games, development (C#, Python) and mythology, I combine my technical interests with a clear career vision: joining the French Air Force after a master's degree (BAC+5) and starting my own IT company.",
        'I actively build my skills through certifications (Cisco, Microsoft, Google, Nvidia) and hands-on infrastructure projects.',
      ],
      tags: ['Infrastructure', 'Cybersecurity', 'Networking', 'Work-study', 'BAC+2'],
      docCvLabel: 'Resume',
      docTableauLabel: 'Summary Table',
    },

    parcours: {
      sectionSubtitle: 'My academic path',
      entries: [
        {
          date: 'Sept 2025 — Present',
          badge: 'Ongoing',
          title: 'BTS SIO — SISR Track',
          subtitle: 'BTS IT Services for Organizations',
          paragraphs: [
            'Ensitech, Cergy',
            'Infrastructure, Systems and Network Solutions track',
            'Work-study program focused on system administration, network management and cybersecurity.',
          ],
        },
        {
          date: 'Sept 2022 — June 2025',
          badge: 'Passed with honors',
          title: 'General Baccalaureate',
          subtitle: 'Scientific majors',
          paragraphs: [
            'AMC (English for the Contemporary World) and NSI (Digital and Computer Science) majors',
            'Foundational training in computer science and programming.',
          ],
        },
        {
          date: '2018 — 2022',
          badge: 'Passed with honors',
          title: 'Middle school',
          subtitle: 'National diploma (Brevet)',
          paragraphs: ['Obtained the national middle-school diploma with honors.'],
        },
      ],
    },

    competences: {
      sectionSubtitle: 'My technical expertise',
      categories: [
        {
          title: 'System Administration',
          skills: ['Linux (Debian, Ubuntu, Kali)', 'Windows Server', 'Virtualization (VMware, Proxmox)'],
        },
        {
          title: 'Networking',
          skills: ['Network configuration (VLAN, routing)', 'Firewall (pfSense, iptables)', 'Network services (DNS, DHCP, VPN)'],
        },
        {
          title: 'Cybersecurity',
          skills: ['Security auditing', 'Pentesting (Kali, Nmap, Burp Suite)', 'SSL/TLS, certificates'],
        },
        {
          title: 'Development & Scripting',
          skills: ['Bash / Shell scripting', 'Python', 'C#'],
        },
      ],
    },

    certifications: {
      sectionSubtitle: 'My accreditations and certificates',
      filters: [
        { id: 'all', label: 'All' },
        { id: 'langue', label: 'Languages' },
        { id: 'reseau', label: 'Network' },
        { id: 'cloud', label: 'Cloud & AI' },
        { id: 'securite', label: 'Security' },
        { id: 'methode', label: 'Methods' },
        { id: 'mooc', label: 'MOOC' },
      ],
      items: [
        {
          badgeLabel: 'Language',
          title: 'Cambridge English Certificate',
          issuer: 'Cambridge University Press & Assessment',
          description: 'Official English proficiency certificate issued by Cambridge.',
          level: 'B2 — Upper Intermediate',
        },
      ],
    },

    projets: {
      sectionSubtitle: 'My technical projects',
      items: [
        {
          title: 'LAMP Web Server',
          description: 'Deployment of a Linux Apache MariaDB PHP server with automated backups and monitoring.',
        },
        {
          title: 'VM Network Infrastructure',
          description: 'Full VMware setup with VLAN routing, pfSense firewall and network segmentation.',
        },
        {
          title: 'Python Application',
          description: 'Development of a Python tool for various tasks, such as creating local admin accounts, etc.',
        },
        {
          title: 'C# Code Maintenance',
          description: 'Bug fixes and feature additions on a management application.',
        },
        {
          title: 'Security Audit',
          description: 'Vulnerability scanning and penetration testing on a test infrastructure with Kali Linux.',
        },
        {
          title: 'Web Portfolio',
          description: 'Building this portfolio, hosted on o2switch with Apache and SSL configuration.',
        },
        {
          title: 'Active Directory & GPO',
          description:
            'E6 technical documentation: setting up an Active Directory domain and group policies on Windows Server 2025.',
        },
      ],
    },

    veille: {
      sectionSubtitle: 'Quantum Computers vs Classical Computers',
      githubLabel: 'View the GitHub repository',
      introPrefix: 'My technology watch topic is quantum technology, specifically: ',
      introStrong: 'the real differences between a so-called "Quantum" computer and a so-called "Classical" computer',
      classicTitle: 'Classical Computer',
      quantumTitle: 'Quantum Computer',
      classicFeatures: [
        { label: 'Unit', value: 'Bit (0 or 1)' },
        { label: 'Technology', value: 'Transistors' },
        { label: 'Processing', value: 'Sequential' },
        { label: '💪 Advantage', value: 'Reliable and mature' },
      ],
      quantumFeatures: [
        { label: 'Unit', value: 'Qubit (0 and 1)' },
        { label: 'Technology', value: 'Quantum mechanics' },
        { label: 'Processing', value: 'Massively parallel' },
        { label: '⚡ Advantage', value: 'Ultra-fast' },
      ],
      domainesTitle: '🎯 Impacted Fields',
      domaines: [{ label: 'Cryptography' }, { label: 'Medicine' }, { label: 'AI' }, { label: 'Optimization' }],
      sourcesTitle: '📚 My Sources',
      sources: [{ label: 'Research' }, { label: 'Industry' }, { label: 'Training' }, { label: 'News' }],
      methodesTitle: '🔍 My Methods',
      methodes: [{ label: 'RSS Feeds' }, { label: 'Feedly' }, { label: 'Communities' }, { label: 'LinkedIn' }],
      conclusionTitle: '💡 Why This Topic?',
      conclusionText:
        'Quantum computing will directly impact cybersecurity and infrastructure. This technology watch lets me anticipate the evolution of encryption and prepare for the transition to the post-quantum era.',
    },

    contact: {
      sectionSubtitle: "Let's stay in touch",
      heading: 'My contact details',
      emailLabel: 'Email',
      githubLabel: 'GitHub',
      locationLabel: 'Location',
      location: 'Beauvais, Hauts-de-France, France',
      statusLabel: 'Status',
      statusPrefix: 'Work-study BTS SIO SISR student at',
      statusSuffix: 'in Esches',
    },

    terms: {
      title: 'Terms of use',
      accept: 'I accept',
      refuse: 'Decline',
      close: 'Close',
    },
  },
};
