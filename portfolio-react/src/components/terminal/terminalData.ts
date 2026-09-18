export const COMMANDS: Record<string, string> = {
  help: 'Liste toutes les commandes disponibles',
  whoami: 'Affiche le profil de Léo',
  skills: 'Graphique ASCII des compétences',
  contact: 'Email et liens de contact',
  fortune: 'Citation aléatoire (mythologie, tech, anime)',
  blague: 'Blague sèche du jour',
  ping: 'Mesure la latence vers lesnorrys.fr',
  countdown: 'Compte à rebours avant la fin du BTS',
  history: 'Historique des commandes de la session',
  refresh: 'Recharge la page',
  theme: 'Bascule clair / sombre',
  secret: 'Déclenche le Matrix rain',
  hack: 'Simulation de hacking (pour rire)',
  weather: 'Météo en direct (géolocalisation)',
  timezone: "Changer le fuseau horaire de l'horloge",
  cv: 'Télécharge le CV',
  matrix: 'Mini pluie de caractères dans le terminal',
  lang: 'Changer la langue (fr|en)',
  clear: 'Vide le terminal',
  exit: 'Ferme le terminal',
}

export const TIMEZONE_MAP: Record<string, string> = {
  europe: 'Europe/Paris',
  london: 'Europe/London',
  'new-york': 'America/New_York',
  tokyo: 'Asia/Tokyo',
  sydney: 'Australia/Sydney',
  utc: 'UTC',
}

export const FORTUNES: { text: string; src: string }[] = [
  {
    text: 'Cattle die, kindred die — every man is mortal. But the glory of the great dead never dies.',
    src: '— Hávamál',
  },
  { text: 'A man who never shuts up knows very little.', src: '— Hávamál' },
  {
    text: "Je sais que je suis pendu à l'arbre balayé par le vent, blessé par une lance, offert à moi-même — pour arracher les runes à l'abîme.",
    src: '— Hávamál (Odin découvre les runes)',
  },
  {
    text: "Soixante-douze métamorphoses — et l'esprit-singe ne peut toujours pas s'échapper de sa propre nature.",
    src: '— Wu Cheng’en, Le Voyage en Occident',
  },
  {
    text: "Je suis né de la pierre, nourri par le vent. Je ne dois ma vie à personne — et pourtant me voilà serviteur.",
    src: '— Le Voyage en Occident',
  },
  {
    text: "Even if we painstakingly piece together something lost, it doesn't mean things will go back to how they were.",
    src: '— Kentaro Miura, Berserk',
  },
  {
    text: 'In this world, is the destiny of mankind controlled by some transcendental entity or law? At least it is true that man has no control, even over his own will.',
    src: '— Berserk, Kentaro Miura',
  },
  { text: 'If you want to get to know someone, find out what makes them angry.', src: '— Ging Freecss, Hunter × Hunter' },
  {
    text: "You should enjoy the little detours to the fullest. Because that's where you'll find the things more important than what you want.",
    src: '— Ging Freecss, Hunter × Hunter',
  },
  {
    text: "A lesson without pain is meaningless. That's because no one can gain without sacrificing something.",
    src: '— Edward Elric, Fullmetal Alchemist',
  },
  {
    text: 'Humankind cannot gain anything without first giving something in return. To obtain, something of equal value must be lost.',
    src: '— Fullmetal Alchemist, Law of Equivalent Exchange',
  },
  {
    text: "The strength to continue forward comes not from the light ahead, but from the darkness you've already crossed.",
    src: '— Guts, Berserk (paraphrase)',
  },
  { text: 'Security is not a product, but a process.', src: '— Bruce Schneier' },
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', src: '— Harold Abelson, SICP' },
  { text: 'The quieter you become, the more you are able to hear.', src: '— Kali Linux' },
  {
    text: 'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.',
    src: '— Antoine de Saint-Exupéry',
  },
  { text: 'Any sufficiently advanced technology is indistinguishable from magic.', src: '— Arthur C. Clarke' },
  {
    text: "L'ennui est le seuil du danger — c'est là que naissent les vraies idées.",
    src: '— Hisoka Morow, Hunter × Hunter (paraphrase)',
  },
  {
    text: 'What cannot be cured must be endured — and what is endured shapes what you become.',
    src: '— Casca, Berserk (paraphrase)',
  },
  { text: 'The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.', src: '— Marcel Proust' },
]

export const BLAGUES: string[] = [
  'Il y a 10 types de personnes : ceux qui comprennent le binaire, et les autres.',
  'Un SQL se promène dans un bar, voit deux tables et demande : « Je peux JOIN ? »',
  'Récursion : voir « Récursion ».',
  "Mon code fonctionne. Je ne sais pas pourquoi. Je n'y touche plus.",
  '404 : blague introuvable.',
  "Je ne dors pas — j'attends que le build se termine.",
  "L'optimisme en informatique, c'est croire que le bug est dans le code des autres.",
  'rm -rf /. Rien à voir. Circulez.',
  'Un dev senior, c’est un dev junior qui a appris à dire « ça dépend ».',
  '« Ça marche en local » — épitaphe d’un serveur de production.',
]
