import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n/I18nContext';
import { useRegisterSection } from '../../hooks/useRegisterSection';
import { TagTooltipProvider } from '../../context/TagTooltipContext';
import { useCardTilt } from '../projects/useCardTilt';
import { Tag } from '../projects/Tag';
import { DocActions } from '../docviewer/DocActions';

const EMOJIS = ['🖥️', '🌐', '🐍', '💻', '🔒', '🌍', '🗂️'];
const TAGS = [
  ['Linux', 'Apache', 'Bash', 'SSL'],
  ['VMware', 'Réseau', 'pfSense', 'VLAN'],
  ['Python', 'TI-Python', 'JSON'],
  ['C#', '.NET', 'Debugging'],
  ['Kali Linux', 'Nmap', 'Pentesting'],
  ['HTML/CSS', 'Apache', 'o2switch'],
  ['Active Directory', 'Windows Server', 'GPO', 'DNS'],
];
const DOC_BASE = 'docs/Docu_AD/AD_Documentation_Leo';

interface ProjectDef {
  emoji: string;
  title: string;
  description: string;
  tags: string[];
  docBase?: string;
}

function ProjectCard({ project }: { project: ProjectDef }) {
  const { colors } = useTheme();
  const { cardRef, shineRef, onTouchStart } = useCardTilt<View>();

  return (
    <View
      ref={cardRef}
      onTouchStart={onTouchStart}
      style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
    >
      <View style={[styles.imageWrap, { backgroundColor: colors.accentGlow }]}>
        <Text style={styles.emoji}>{project.emoji}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{project.title}</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>{project.description}</Text>
        <View style={styles.tags}>
          {project.tags.map((tag) => (
            <Tag key={tag} name={tag} />
          ))}
        </View>
        {project.docBase && (
          <View style={styles.docBtn}>
            <DocActions base={project.docBase} />
          </View>
        )}
      </View>
      <View ref={shineRef} pointerEvents="none" style={styles.shine} />
    </View>
  );
}

export function Projets() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const onLayout = useRegisterSection('projets');

  const projects: ProjectDef[] = t.projets.items.map((item, i) => ({
    emoji: EMOJIS[i],
    title: item.title,
    description: item.description,
    tags: TAGS[i],
    docBase: i === TAGS.length - 1 ? DOC_BASE : undefined,
  }));

  return (
    <TagTooltipProvider>
      <View nativeID="projets" onLayout={onLayout} style={[styles.section, { backgroundColor: colors.darkSecondary }]}>
        <Text style={[styles.sectionNumber, { color: colors.accent }]}>05</Text>
        <Text style={[styles.h2, { color: colors.text }]}>{t.nav[5]}</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t.projets.sectionSubtitle}</Text>

        <View style={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </View>
      </View>
    </TagTooltipProvider>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
    paddingTop: 40,
    gap: 8,
  },
  sectionNumber: {
    fontSize: 12,
    fontWeight: '800',
  },
  h2: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  grid: {
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageWrap: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 34,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  docBtn: {
    marginTop: 6,
  },
  shine: {
    ...StyleSheet.absoluteFill,
    opacity: 0,
  },
});
