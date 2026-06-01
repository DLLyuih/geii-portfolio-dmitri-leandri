import { getSkills } from '@/lib/db';
import * as LucideIcons from 'lucide-react';

export const dynamic = 'force-dynamic';

// Helper component to render icons dynamically based on name stored in DB
function DynamicIcon({ name, size = 24, ...props }) {
  const IconComponent = LucideIcons[name] || LucideIcons.BookOpen; // Fallback to BookOpen
  return <IconComponent size={size} {...props} />;
}

export default async function Competences() {
  const skills = await getSkills();

  // Categories mapping
  const categories = {
    programmation: {
      title: "Programmation",
      description: "Langages de programmation embarquée, d'acquisition de données et d'outils web."
    },
    logiciels: {
      title: "Logiciels & Outils CAO",
      description: "Logiciels de simulation, de conception assistée par ordinateur (CAO) et d'instrumentation."
    },
    techniques: {
      title: "Compétences Techniques GEII",
      description: "Domaines de spécialité en génie électrique, réseaux de terrain et automatique."
    }
  };

  // Group skills by category
  const groupedSkills = {
    programmation: [],
    logiciels: [],
    techniques: []
  };

  skills.forEach(skill => {
    const category = skill.category ? skill.category.toLowerCase() : 'techniques';
    if (groupedSkills[category]) {
      groupedSkills[category].push(skill);
    } else {
      groupedSkills.techniques.push(skill);
    }
  });

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <h1 className="section-title" style={{ marginTop: '40px' }}>Mes Compétences</h1>
      <p className="section-subtitle">
        Maîtrises logicielles, langages de programmation et savoir-faire techniques acquis dans le cadre de mon BUT GEII.
      </p>

      {Object.entries(categories).map(([key, cat]) => (
        <section key={key} style={{ marginTop: '48px' }}>
          <div style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '16px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{cat.title}</h2>
            <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>{cat.description}</p>
          </div>

          <div className="skills-grid">
            {groupedSkills[key] && groupedSkills[key].length > 0 ? (
              groupedSkills[key].map((skill) => (
                <div key={skill.id} className="card skill-card">
                  <div className="skill-header">
                    <div className="skill-icon-container">
                      <DynamicIcon name={skill.icon} />
                    </div>
                    <div>
                      <h3 className="skill-name">{skill.name}</h3>
                    </div>
                  </div>
                  
                  {skill.description && (
                    <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9rem', lineHeight: 1.4, flexGrow: 1 }}>
                      {skill.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'auto' }}>
                    <div className="skill-level-text">
                      <span>Maîtrise</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="skill-bar-container">
                      <div className="skill-bar" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--foreground-muted)', gridColumn: '1 / -1', fontSize: '0.95rem' }}>
                Aucune compétence dans cette catégorie pour le moment.
              </p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
